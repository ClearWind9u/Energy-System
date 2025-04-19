import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { useTheme } from "../navigation/ThemeContext";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface ChartData {
  usage: ChartDataPoint[];
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
  current: ChartDataPoint[];
  voltage_light: ChartDataPoint[];
}

interface MaxValues {
  max_temperature: number | null;
  max_humidity: number | null;
  avg_temperature: number | null;
  avg_humidity: number | null;
}

export default function ChartScreen({ navigation, route }: any) {
  const { isDayMode } = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;
  const { selectedDate, userID } = route.params;

  const [chartData, setChartData] = useState<ChartData>({
    usage: [],
    temperature: [],
    humidity: [],
    current: [],
    voltage_light: [],
  });
  const [maxValues, setMaxValues] = useState<MaxValues>({
    max_temperature: null,
    max_humidity: null,
    avg_temperature: null,
    avg_humidity: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#FFCD56", "#C9CB3F", "#FF5733", "#C678DD",
    "#36A2EB", "#FF6384"
  ];

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/records`;
      const response = await axios.get(apiURL, {
        params: {
          filter: "year",
          date: selectedDate,
        },
      });

      const monthSummary: {
        [key: number]: {
          usage: number;
          temperature: number;
          humidity: number;
          current: number;
          voltage_light: number;
          count: number;
        };
      } = {};
      for (let i = 1; i <= 12; i++) {
        monthSummary[i] = {
          usage: 0,
          temperature: 0,
          humidity: 0,
          current: 0,
          voltage_light: 0,
          count: 0,
        };
      }

      let totalTemperature = 0;
      let totalHumidity = 0;
      let totalCount = 0;

      response.data.forEach((item: any) => {
        item.devices.forEach((device: any) => {
          const date = new Date(device.time);
          if (isNaN(date.getTime())) {
            console.warn("Invalid date:", device.time);
            return;
          }
          const month = date.getMonth() + 1;
          const kWhPerDay = (device.current * device.voltage_light * 24) / 1000;
          monthSummary[month].usage += kWhPerDay;
          monthSummary[month].temperature += device.temperature;
          monthSummary[month].humidity += device.humidity;
          monthSummary[month].current += device.current;
          monthSummary[month].voltage_light += device.voltage_light;
          monthSummary[month].count += 1;

          totalTemperature += device.temperature;
          totalHumidity += device.humidity;
          totalCount += 1;
        });
      });
      // Tính nhiệt độ và độ ẩm trung bình của năm
      const avgTemperature = totalCount > 0 ? Number((totalTemperature / totalCount).toFixed(1)) : null;
      const avgHumidity = totalCount > 0 ? Number((totalHumidity / totalCount).toFixed(1)) : null;

      const chartDataFormatted: ChartData = {
        usage: [],
        temperature: [],
        humidity: [],
        current: [],
        voltage_light: [],
      };

      Object.keys(monthSummary).forEach((monthStr, index) => {
        const month = parseInt(monthStr);
        const summary = monthSummary[month];
        const count = summary.count || 1;

        // Tính giá trị cho biểu đồ
        const usageValue = summary.count ? Number(summary.usage.toFixed(2)) : 0;
        const tempValue = summary.count ? Number((summary.temperature / count).toFixed(1)) : 0;
        const humidityValue = summary.count ? Number((summary.humidity / count).toFixed(1)) : 0;
        const currentValue = summary.count ? Number((summary.current / count).toFixed(1)) : 0;
        const voltageValue = summary.count ? Number((summary.voltage_light / count).toFixed(0)) : 0;

        chartDataFormatted.usage.push({
          name: `${monthNames[month - 1]} (${usageValue} kWh)`,
          value: usageValue,
          color: colors[index],
          legendFontColor: isDayMode ? "#333" : "#fff",
          legendFontSize: 14,
        });
        chartDataFormatted.temperature.push({
          name: `${monthNames[month - 1]} (${tempValue} °C)`,
          value: tempValue,
          color: colors[index],
          legendFontColor: isDayMode ? "#333" : "#fff",
          legendFontSize: 14,
        });
        chartDataFormatted.humidity.push({
          name: `${monthNames[month - 1]} (${humidityValue} %)`,
          value: humidityValue,
          color: colors[index],
          legendFontColor: isDayMode ? "#333" : "#fff",
          legendFontSize: 14,
        });
        chartDataFormatted.current.push({
          name: `${monthNames[month - 1]} (${currentValue} A)`,
          value: currentValue,
          color: colors[index],
          legendFontColor: isDayMode ? "#333" : "#fff",
          legendFontSize: 14,
        });
        chartDataFormatted.voltage_light.push({
          name: `${monthNames[month - 1]} (${voltageValue} V)`,
          value: voltageValue,
          color: colors[index],
          legendFontColor: isDayMode ? "#333" : "#fff",
          legendFontSize: 14,
        });
      });

      setChartData(chartDataFormatted);
      setMaxValues((prev) => ({
        ...prev,
        avg_temperature: avgTemperature,
        avg_humidity: avgHumidity,
      }));
    } catch (err: any) {
      console.error("Error fetching chart data:", err.message);
      setError("Không thể tải dữ liệu biểu đồ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMaxValues = async () => {
    try {
      const year = new Date(selectedDate).getFullYear();
      const apiURL = `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3000/device/getMaxValue`;
      const response = await axios.get(apiURL, {
        params: { year },
      });
      setMaxValues((prev) => ({
        ...prev,
        max_temperature: response.data.data.max_temperature || null,
        max_humidity: response.data.data.max_humidity || null,
      }));
    } catch (err: any) {
      console.error("Error fetching max values:", err.message);
      setError("Không thể tải giá trị lớn nhất. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchChartData();
    fetchMaxValues();
  }, [selectedDate]);

  const renderLegend = (data: ChartDataPoint[]) => {
    const filteredData = data.filter((d) => d.value > 0);
    return (
      <View style={styles.legendContainer}>
        {filteredData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: item.legendFontColor }]}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPieChart = (data: ChartDataPoint[], title: string, unit: string) => {
    const filteredData = data.filter((d) => d.value > 0);
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, currentStyles.text]}>{`${title} (${unit})`}</Text>
        {renderLegend(filteredData)}
        {filteredData.length > 0 ? (
          <View style={styles.pieChartContainer}>
            <PieChart
              data={filteredData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => isDayMode ? `rgba(100, 100, 100, ${opacity})` : `rgba(200, 200, 200, ${opacity})`,
                labelColor: () => currentStyles.text.color,
                decimalPlaces: 0,
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="90"
              absolute={false}
              hasLegend={false}
              style={styles.pieChart}
            />
          </View>
        ) : (
          <Text style={[styles.noDataText, currentStyles.text]}>
            Không có dữ liệu để hiển thị
          </Text>
        )}
      </View>
    );
  };

  const renderBarChart = (data: ChartDataPoint[], title: string, unit: string) => {
    const filteredData = data.filter((d) => d.value > 0);
    const barData = {
      labels: filteredData.map((d) => monthNames[parseInt(d.name.split(" ")[1]) - 1]),
      datasets: [
        {
          data: filteredData.map((d) => d.value),
          colors: filteredData.map((d) => (opacity = 1) => d.color),
        },
      ],
    };
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, currentStyles.text]}>{`${title} (${unit})`}</Text>
        {filteredData.length > 0 ? (
          <View style={styles.barChartContainer}>
            <BarChart
              data={barData}
              width={screenWidth - 40}
              height={220}
              fromZero={true}
              chartConfig={{
                backgroundColor: isDayMode ? "#E6F0FA" : "#2A2A2A",
                backgroundGradientFrom: isDayMode ? "#E6F0FA" : "#2A2A2A",
                backgroundGradientTo: isDayMode ? "#F0F8FF" : "#333333",
                decimalPlaces: 0,
                color: (opacity = 1) => isDayMode ? `rgba(100, 100, 100, ${opacity})` : `rgba(200, 200, 200, ${opacity})`,
                labelColor: () => currentStyles.text.color,
                barPercentage: 0.6,
                barRadius: 4,
                fillShadowGradient: isDayMode ? "#4A90E2" : "#6B9BF2",
                fillShadowGradientOpacity: 1,
                propsForLabels: {
                  fontSize: 12,
                  fontWeight: "500",
                },
              }}
              style={styles.barChart}
              showValuesOnTopOfBars={true}
              withCustomBarColorFromData={true}
              flatColor={true}
            />
          </View>
        ) : (
          <Text style={[styles.noDataText, currentStyles.text]}>
            Không có dữ liệu để hiển thị
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, currentStyles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>
        <Text style={[styles.title, currentStyles.text]}>
          Biểu đồ năm {new Date(selectedDate).getFullYear()}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.maxValuesContainer, currentStyles.maxValuesContainer]}>
        <View style={styles.maxValueItem}>
          <FontAwesome
            name="thermometer"
            size={16}
            color={isDayMode ? "#4A90E2" : "#6B9BF2"}
            style={styles.maxValueIcon}
          />
          <Text style={[styles.maxValuesText, currentStyles.maxValuesText]}>
            Nhiệt độ lớn nhất: {maxValues.max_temperature !== null ? `${maxValues.max_temperature} °C` : "Không có dữ liệu"}
          </Text>
        </View>
        <View style={styles.maxValueItem}>
          <FontAwesome
            name="thermometer-half"
            size={16}
            color={isDayMode ? "#4A90E2" : "#6B9BF2"}
            style={styles.maxValueIcon}
          />
          <Text style={[styles.maxValuesText, currentStyles.maxValuesText]}>
            Nhiệt độ trung bình: {maxValues.avg_temperature !== null ? `${maxValues.avg_temperature} °C` : "Không có dữ liệu"}
          </Text>
        </View>
        <View style={styles.maxValueItem}>
          <FontAwesome
            name="tint"
            size={16}
            color={isDayMode ? "#4A90E2" : "#6B9BF2"}
            style={styles.maxValueIcon}
          />
          <Text style={[styles.maxValuesText, currentStyles.maxValuesText]}>
            Độ ẩm lớn nhất: {maxValues.max_humidity !== null ? `${maxValues.max_humidity} %` : "Không có dữ liệu"}
          </Text>
        </View>
        <View style={styles.maxValueItem}>
          <FontAwesome
            name="tint"
            size={16}
            color={isDayMode ? "#4A90E2" : "#6B9BF2"}
            style={styles.maxValueIcon}
          />
          <Text style={[styles.maxValuesText, currentStyles.maxValuesText]}>
            Độ ẩm trung bình: {maxValues.avg_humidity !== null ? `${maxValues.avg_humidity} %` : "Không có dữ liệu"}
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={isDayMode ? "#4A90E2" : "#6B9BF2"} />
      ) : error ? (
        <Text style={[styles.noDataText, currentStyles.text]}>{error}</Text>
      ) : (
        <ScrollView style={styles.chartList}>
          {renderPieChart(chartData.usage, "Tổng tiêu thụ điện", "kWh")}
          {renderBarChart(chartData.temperature, "Nhiệt độ trung bình", "°C")}
          {renderBarChart(chartData.humidity, "Độ ẩm trung bình", "%")}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  chartList: {
    flex: 1,
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: screenWidth - 40,
  },
  pieChart: {
    alignSelf: "center",
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  barChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: screenWidth - 40,
  },
  barChart: {
    alignSelf: "center",
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  maxValuesContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  maxValueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  maxValueIcon: {
    marginRight: 8,
  },
  maxValuesText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

const dayModeStyles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  text: { color: "black" },
  maxValuesContainer: {
    backgroundColor: "#F0F8FF",
    borderWidth: 1,
    borderColor: "#D3E3FD",
  },
  maxValuesText: {
    color: "#4A90E2",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

const nightModeStyles = StyleSheet.create({
  container: { backgroundColor: "#1E1E1E" },
  text: { color: "white" },
  maxValuesContainer: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  maxValuesText: {
    color: "#6B9BF2",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});