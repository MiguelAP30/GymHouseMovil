import { View, Text } from 'react-native'

interface CustomButtonProps {
    color: ''
    text: String
    actionFunction: () => void
}

const CustomButton = ({color,text, actionFunction}: CustomButtonProps) => {
  return (
    <View>
      <Text>CustomButton</Text>
    </View>
  )
}

export default CustomButton