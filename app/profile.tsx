
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, FlatList} from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const Profile = () => {
  const [name, setName] = React.useState('')

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'index',
      page: '/index'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      page: '/register'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      page: '/index'
    },
  ];
  
  type ItemProps = {
    title: string,
    page: string
  };
  
  const Item = ({title, page}: ItemProps) => (
    <View >
      <Link href={page}>
        <Text className='bg-red-600'>{title}</Text>
      </Link>
    </View>
  );
  return (
    <View className='flex items-center justify-center h-full bg-slate-400'>
      <ScrollView className={`w-[90%] p-4 bg-slate-100`}>
        <Text className='text-black text-2xl font-bold mb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat odit
          perferendis eligendi vitae illo provident eaque magni? Sunt, recusandae
          libero autem, ullam, laboriosam minus ex dolores tempore sequi quae sint?
        </Text>
        <Text className='text-black text-2xl font-bold mb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat odit
          perferendis eligendi vitae illo provident eaque magni? Sunt, recusandae
          libero autem, ullam, laboriosam minus ex dolores tempore sequi quae sint?
        </Text>
        <Text className='text-black text-2xl font-bold mb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat odit
          perferendis eligendi vitae illo provident eaque magni? Sunt, recusandae
          libero autem, ullam, laboriosam minus ex dolores tempore sequi quae sint?
        </Text>
        <Text className='text-black text-2xl font-bold mb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat odit
          perferendis eligendi vitae illo provident eaque magni? Sunt, recusandae
          libero autem, ullam, laboriosam minus ex dolores tempore sequi quae sint?
        </Text>

      </ScrollView>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} page={item.page} />}
        keyExtractor={item => item.id}
      />
      {/* <TextInput 
        onChangeText={(text) => console.log(text)}
        className='border border-red-300 p-5 rounded-md w-1/2'
      />
      <Text className='text-2xl text-white mt-5'>Hello, {name}</Text> */}
    </View>
  )
}

//flatlist implementacion facil
//safe area
export default Profile