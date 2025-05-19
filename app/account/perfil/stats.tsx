import React, { useEffect, useState } from 'react';
import {
    View, Text, ActivityIndicator, Dimensions
  } from 'react-native';
import { ProfileDAO, ProfileWithId } from '../../../interfaces/user';
import { getProfileByEmail } from '../../../lib/user';
import { useAuth } from '../../../context/AuthStore';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';

const Stats = () => {
    const [profiles, setProfiles] = useState<ProfileWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedField, setSelectedField] = useState<keyof ProfileWithId>('biceps');
    const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
    const [filteredData, setFilteredData] = useState<Pick<ProfileWithId, keyof ProfileWithId>[]>([]);
    const { user } = useAuth();
    const screenWidth = Dimensions.get('window').width;

    function filterFields<T extends object, K extends keyof T>(arr: T[], keys: K[]): Pick<T, K>[] {
      return arr.map(item => {
        const filtered: Partial<Pick<T, K>> = {};
        keys.forEach(key => {
          filtered[key] = item[key];
        });
        return filtered as Pick<T, K>;
      });
    }

    const fetchProfiles = async () => {
        try {
          if (!user?.email) throw new Error('No hay usuario autenticado');
          const data = await getProfileByEmail(user.email);
          setProfiles(data);
        } catch (error) {
          console.error('Error al obtener los perfiles:', error);
        } finally {
          setLoading(false);
        }
    };

    const filterData = () => {
        try {
            const today = new Date();
            let startDate: Date;

            switch (selectedTimeFilter) {
                case 'week':
                    startDate = new Date(today.setDate(today.getDate() - 7));
                    break;
                case 'month':
                    startDate = new Date(today.setMonth(today.getMonth() - 1));
                    break;
                case 'year':
                    startDate = new Date(today.setFullYear(today.getFullYear() - 1));
                    break;
                default:
                    startDate = new Date(0);
            }

            const timeFiltered = profiles.filter(profile => {
                const profileDate = new Date(profile.date);
                return profileDate >= startDate && profileDate <= new Date();
            });

            const result = filterFields(timeFiltered, [selectedField, "date"]);
            result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setFilteredData(result);
        } catch (error) {
            console.error('Error al filtrar datos:', error);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [user?.email]);

    useEffect(() => {
        if (profiles.length > 0) {
            filterData();
        }
    }, [selectedField, selectedTimeFilter, profiles]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#00bcd4" />
                <Text className="mt-2 text-gray-600">Cargando datos...</Text>
            </View>
        );
    }

    const chartData = {
        labels: filteredData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [{
            data: filteredData.map(item => {
                const value = Number(item[selectedField]);
                return isNaN(value) ? 0 : value;
            })
        }]
    };

    const calculateStats = (data: Pick<ProfileWithId, keyof ProfileWithId>[]) => {
        const values = data.map(item => Number(item[selectedField])).filter(val => !isNaN(val));
        if (values.length === 0) return null;

        const max = Math.max(...values);
        const min = Math.min(...values);
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        
        // Calcular la diferencia entre el primer y último valor
        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        const difference = lastValue - firstValue;
        const percentageChange = ((difference / firstValue) * 100).toFixed(2);

        return {
            max,
            min,
            avg,
            difference,
            percentageChange,
            total: values.length
        };
    };

    const stats = calculateStats(filteredData);

    return (
        <View className="p-4 bg-gray-50">
            <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
                <View className="flex-row items-center gap-2">
                    <View className="flex-1 bg-gray-100 rounded-lg">
                        <Picker
                            selectedValue={selectedField}
                            onValueChange={(value: keyof ProfileWithId) => setSelectedField(value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Bíceps" value="biceps" />
                            <Picker.Item label="Masa muscular" value="muscle" />
                            <Picker.Item label="Pecho" value="chest" />
                            <Picker.Item label="Peso" value="weight" />
                            <Picker.Item label="Altura" value="height" />
                            <Picker.Item label="Caderas" value="hips" />
                            <Picker.Item label="Muslo" value="thigh" />
                            <Picker.Item label="Cintura" value="waist" />
                            <Picker.Item label="Grasa corporal" value="fat" />
                        </Picker>
                    </View>
                    <View className="flex-1 bg-gray-100 rounded-lg">
                        <Picker
                            selectedValue={selectedTimeFilter}
                            onValueChange={(value: string) => setSelectedTimeFilter(value)}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Todos los registros" value="all" />
                            <Picker.Item label="Última semana" value="week" />
                            <Picker.Item label="Último mes" value="month" />
                            <Picker.Item label="Último año" value="year" />
                        </Picker>
                    </View>
                </View>
            </View>

            {filteredData.length > 0 && (
                <View className="bg-white rounded-xl p-4 shadow-md">
                    <Text className="text-lg font-bold mb-2">Gráfico de progreso:</Text>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#007AFF'
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                    {stats && (
                        <View className="mt-4">
                            <Text className="text-gray-700 font-semibold mb-2">Estadísticas:</Text>
                            <View className="space-y-2">
                                <View className="flex-row justify-between py-1 border-b border-gray-200">
                                    <Text className="text-gray-600">Valor máximo:</Text>
                                    <Text className="text-gray-800 font-medium">
                                        {stats.max.toFixed(2)} {selectedField === 'weight' ? 'kg' : 
                                            selectedField === 'height' ? 'cm' : 
                                            selectedField === 'fat' || selectedField === 'muscle' ? '%' : 'cm'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between py-1 border-b border-gray-200">
                                    <Text className="text-gray-600">Valor mínimo:</Text>
                                    <Text className="text-gray-800 font-medium">
                                        {stats.min.toFixed(2)} {selectedField === 'weight' ? 'kg' : 
                                            selectedField === 'height' ? 'cm' : 
                                            selectedField === 'fat' || selectedField === 'muscle' ? '%' : 'cm'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between py-1 border-b border-gray-200">
                                    <Text className="text-gray-600">Promedio:</Text>
                                    <Text className="text-gray-800 font-medium">
                                        {stats.avg.toFixed(2)} {selectedField === 'weight' ? 'kg' : 
                                            selectedField === 'height' ? 'cm' : 
                                            selectedField === 'fat' || selectedField === 'muscle' ? '%' : 'cm'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between py-1 border-b border-gray-200">
                                    <Text className="text-gray-600">Cambio total:</Text>
                                    <Text className={`font-medium ${stats.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.difference >= 0 ? '+' : ''}{stats.difference.toFixed(2)} {selectedField === 'weight' ? 'kg' : 
                                            selectedField === 'height' ? 'cm' : 
                                            selectedField === 'fat' || selectedField === 'muscle' ? '%' : 'cm'}
                                        {' '}({stats.percentageChange}%)
                                    </Text>
                                </View>
                                <View className="flex-row justify-between py-1 border-b border-gray-200">
                                    <Text className="text-gray-600">Total de registros:</Text>
                                    <Text className="text-gray-800 font-medium">{stats.total}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default Stats;