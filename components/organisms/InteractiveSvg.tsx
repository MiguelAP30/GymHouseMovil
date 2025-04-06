import React, { useState, useCallback, useEffect } from 'react';
import { Svg, G, Path } from 'react-native-svg';
import { View } from 'react-native';
import { PathCuerpoFrenteNormal } from '../atoms/PathCuerpoFrenteNormal';

// Define la interfaz para las props
interface FrontBodySvgProps {
  width: number | string;
  height: number | string;
  onPress?: (id: string) => void;
}

const FrontBodySvg: React.FC<FrontBodySvgProps> = ({ width, height, onPress }) => {
  // Estado para rastrear el ID del Path seleccionado
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Efecto para depurar el estado
  useEffect(() => {
    console.log('Estado actualizado - selectedPath:', selectedPath);
  }, [selectedPath]);

  // Función para manejar el toque en un Path
  const handlePathPress = useCallback((id: string) => {
    console.log('Path presionado:', id);
    setSelectedPath(prevPath => {
      if (prevPath === id) {
        return null;
      }
      return id;
    });
    
    if (onPress) {
      console.log('Llamando a onPress con id:', id);
      onPress(id);
    }
  }, [onPress]);

  // Función para determinar el color del fill
  const getFillColor = useCallback((id: string, defaultColor: string) => {
    const isSelected = selectedPath === id;
    return isSelected ? '#FF0000' : defaultColor; // Rojo si está seleccionado, color por defecto si no
  }, [selectedPath]);

  // Función para determinar el grosor del trazo
  const getStrokeWidth = useCallback((id: string) => {
    const isSelected = selectedPath === id;
    return isSelected ? 3 : 1; // Grosor mayor si está seleccionado
  }, [selectedPath]);

  return (
    <View style={{ width: width as any, height: height as any }}>
      <Svg width="100%" height="100%" viewBox="0 0 293 538">
        <G transform="translate(0,538) scale(0.1,-0.1)">
          <Path
            d={PathCuerpoFrenteNormal.CuerpoCompleto}
            fill="#000000"
            id="CuerpoCompleto"
          />
          <G transform="translate(24.000703)">
            <Path
              d={PathCuerpoFrenteNormal.PantorrillaDER}
              fill={getFillColor('PantorrillaDER', '#ffffff')}
              id="PantorrillaDER"
              onPress={() => handlePathPress('PantorrillaDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('PantorrillaDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.PantorrillaIZQ}
              fill={getFillColor('PantorrilaIZQ', '#ffffff')}
              id="PantorrillaIZQ"
              onPress={() => handlePathPress('PantorrillaIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('PantorrillaIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.ArticulacionRodillaDER}
              fill={getFillColor('ArticulacionRodillaDER', '#ffffff')}
              id="ArticulacionRodillaDER"
              onPress={() => handlePathPress('ArticulacionRodillaDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('ArticulacionRodillaDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.ArticulacionRodillaIZQ}
              fill={getFillColor('ArticulacionRodillaIZQ', '#ffffff')}
              id="ArticulacionRodillaIZQ"
              onPress={() => handlePathPress('ArticulacionRodillaIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('ArticulacionRodillaIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.ManoDER}
              fill={getFillColor('ManoDER', '#ffffff')}
              id="ManoDER"
              onPress={() => handlePathPress('ManoDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('ManoDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.ManoIZQ}
              fill={getFillColor('ManoIZQ', '#ffffff')}
              id="ManoIZQ"
              onPress={() => handlePathPress('ManoIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('ManoIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.CuadricepsDER}
              fill={getFillColor('CuadricepsDER', '#ffffff')}
              id="CuadricepsDER"
              onPress={() => handlePathPress('CuadricepsDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('CuadricepsDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.CuadricepsIZQ}
              fill={getFillColor('CuadricepsIZQ', '#ffffff')}
              id="CuadricepsIZQ"
              onPress={() => handlePathPress('CuadricepsIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('CuadricepsIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.AntebrazoDER}
              fill={getFillColor('AntebrazoDER', '#ffffff')}
              id="AntebrazoDER"
              onPress={() => handlePathPress('AntebrazoDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('AntebrazoDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.AntebrazoIZQ}
              fill={getFillColor('AntebrazoIZQ', '#ffffff')}
              id="AntebrazoIZQ"
              onPress={() => handlePathPress('AntebrazoIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('AntebrazoIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.OblicuoDER}
              fill={getFillColor('OblicuoDER', '#ffffff')}
              id="OblicuoDER"
              onPress={() => handlePathPress('OblicuoDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('OblicuoDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.OblicuoIZQ}
              fill={getFillColor('OblicuoIZQ', '#ffffff')}
              id="OblicuoIZQ"
              onPress={() => handlePathPress('OblicuoIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('OblicuoIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.BicepsDER}
              fill={getFillColor('BicepsDER', '#ffffff')}
              id="BicepsDER"
              onPress={() => handlePathPress('BicepsDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('BicepsDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.BicepsIZQ}
              fill={getFillColor('BicepsIZQ', '#ffffff')}
              id="BicepsIZQ"
              onPress={() => handlePathPress('BicepsIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('BicepsIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.PechoDER}
              fill={getFillColor('PechoDER', '#ffffff')}
              id="PechoDER"
              onPress={() => handlePathPress('PechoDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('PechoDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.PechoIZQ}
              fill={getFillColor('PechoIZQ', '#ffffff')}
              id="PechoIZQ"
              onPress={() => handlePathPress('PechoIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('PechoIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.HombroFrontalDER}
              fill={getFillColor('HombroFrontalDER', '#ffffff')}
              id="HombroFrontalDER"
              onPress={() => handlePathPress('HombroFrontalDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('HombroFrontalDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.HombroFrontalIZQ}
              fill={getFillColor('HombroFrontalIZQ', '#ffffff')}
              id="HombroFrontalIZQ"
              onPress={() => handlePathPress('HombroFrontalIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('HombroFrontalIZQ')}
            />
            <Path
              d={PathCuerpoFrenteNormal.TrapecioAltoDER}
              fill={getFillColor('TrapecioAltoDER', '#ffffff')}
              id="TrapecioAltoDER"
              onPress={() => handlePathPress('TrapecioAltoDER')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('TrapecioAltoDER')}
            />
            <Path
              d={PathCuerpoFrenteNormal.TrapecioAltoIZQ}
              fill={getFillColor('TrapecioAltoIZQ', '#ffffff')}
              id="TrapecioAltoIZQ"
              onPress={() => handlePathPress('TrapecioAltoIZQ')}
              stroke="#000000"
              strokeWidth={getStrokeWidth('TrapecioAltoIZQ')}
            />
          </G>
          <Path
            d={PathCuerpoFrenteNormal.Abdomen}
            fill={getFillColor('Abdomen', '#ffffff')}
            id="Abdomen"
            onPress={() => handlePathPress('Abdomen')}
            stroke="#000000"
            strokeWidth={getStrokeWidth('Abdomen')}
          />
          <Path
            d={PathCuerpoFrenteNormal.Cuello}
            fill={getFillColor('Cuello', '#ffffff')}
            id="Cuello"
            onPress={() => handlePathPress('Cuello')}
            stroke="#000000"
            strokeWidth={getStrokeWidth('Cuello')}
          />
          <Path
            d={PathCuerpoFrenteNormal.Rostro}
            fill={getFillColor('Rostro', '#ffffff')}
            id="Rostro"
            onPress={() => handlePathPress('Rostro')}
            stroke="#000000"
            strokeWidth={getStrokeWidth('Rostro')}
          />
          <Path
            d={PathCuerpoFrenteNormal.Pelo}
            fill={getFillColor('Pelo', '#ffffff')}
            id="Pelo"
            onPress={() => handlePathPress('Pelo')}
            stroke="#000000"
            strokeWidth={getStrokeWidth('Pelo')}
          />
          <Path
            d={PathCuerpoFrenteNormal.RayaGuiaAbdominal4}
            fill="#000000"
            id="RayaGuiaAbdominal4"
          />
          <Path
            d={PathCuerpoFrenteNormal.RayaGuiaAbdominal3}
            fill="#000000"
            id="RayaGuiaAbdominal3"
          />
          <Path
            d={PathCuerpoFrenteNormal.RayaGuiaAbdominal2}
            fill="#000000"
            id="RayaGuiaAbdominal2"
          />
          <Path
            d={PathCuerpoFrenteNormal.RayaGuiaAbdominal1}
            fill="#000000"
            id="RayaGuiaAbdominal1"
          />
        </G>
      </Svg>
    </View>
  );
};

export default FrontBodySvg;