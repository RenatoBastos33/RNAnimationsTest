import * as React from 'react';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity, SafeAreaView, Dimensions, Image, Animated, ScrollView, StyleSheet, BackHandler, ListView, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, useHeaderHeight, CardStyleInterpolators, HeaderBackButton } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';


function HomeScreen({ route }) {

  const imageScale = Dimensions.get('window').width / route.params.imagePosition.width
  const image = route.params.image
  const headerHeight = useHeaderHeight()
  const navigation = useNavigation()


  const [imageOldPosition] = React.useState({ ...route.params.imagePosition, y: route.params.imagePosition.y })
  const [imageAnimation] = React.useState(new Animated.Value(0))
  const [scrollAnimation] = React.useState(new Animated.Value(0))
  const [headerAnimation] = React.useState(new Animated.Value(0))
  console.log('ImagePosition!', imageOldPosition, headerHeight)

  const [offsetScroll, setoffsetScroll] = React.useState(0)
  const [headerTransparent, setHeaderTransparent] = React.useState(true)

  const goBackAnimation = () => {
    Animated.parallel([
      Animated.timing(imageAnimation, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(scrollAnimation, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start(() => navigation.goBack())
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }) => (<HeaderBackButton tintColor={tintColor} onPress={() => goBackAnimation()} />),
      headerBackground: () => <Animated.View style={[{
        elevation: headerAnimation.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 4]
        }),
        backgroundColor: headerAnimation.interpolate({
          inputRange: [0, 100],
          outputRange: ['rgba(0,0,0,0)', 'rgba(256,256,256,1)']
        })
      }, StyleSheet.absoluteFill]} />, headerTransparent: true
    })
    Animated.timing(imageAnimation, { toValue: 1, duration: 500, useNativeDriver: true }).start()
  }, [])

  React.useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPressAndroid
    );
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPressAndroid
      );
    };
  }, []);
  const handleBackButtonPressAndroid = () => {
    if (!navigation.isFocused()) {
      console.log('Entrou no if')
      return false;
    }
    console.log('Não entrou no if')
    goBackAnimation()
    return true;
  };

  React.useEffect(() => {
    if (headerTransparent) {
      if (offsetScroll > (imageOldPosition.height * imageScale) - headerHeight) {
        navigation.setOptions({ headerTintColor: 'black' })
        Animated.timing(headerAnimation, { toValue: 100, duration: 700 }).start()
        setHeaderTransparent(false)
      }
    }
    else {
      if (offsetScroll <= (imageOldPosition.height * imageScale) - headerHeight) {
        navigation.setOptions({ headerTintColor: 'white' })
        Animated.timing(headerAnimation, { toValue: 0, duration: 700 }).start()
        setHeaderTransparent(true)
      }
    }
  }, [offsetScroll])

  return (
    <ScrollView
      style={{ flex: 1, }}
      onScroll={Animated.event([{
        nativeEvent: { contentOffset: { y: scrollAnimation } },
      }], { listener: (event) => setoffsetScroll(event.nativeEvent.contentOffset.y) })}>
      < View style={{ height: imageOldPosition.height * imageScale }}>
        <Animated.Image source={image}
          style={{
            width: imageOldPosition.width,
            height: imageOldPosition.height,
            opacity: scrollAnimation.interpolate({ inputRange: [0, imageOldPosition.height * imageScale], outputRange: [1, 0] }),
            transform: [
              {
                translateY: imageAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [imageOldPosition.y + offsetScroll, ((imageOldPosition.height * imageScale) - imageOldPosition.height) / 2]
                })
              },
              {
                translateX: imageAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [imageOldPosition.x, ((imageOldPosition.width * imageScale) - imageOldPosition.width) / 2]
                })
              },
              {
                scale: imageAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, imageScale]
                })
              }
            ]
          }} resizeMode={'cover'} />
      </View>

      <Animated.View style={{
        alignItems: 'center',
        opacity: imageAnimation
      }} >
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
      </Animated.View>
    </ScrollView >
  );
}

function SettingsScreen() {
  const navigation = useNavigation()
  const [flatListPosition, setFlatListPosition] = React.useState()
  const [offsetScrollFlat, setoffsetScrollFlat] = React.useState(0)
  const [offsetScroll, setoffsetScroll] = React.useState(0)


  const images = [require('./restaurant.jpg'), require('./restaurant2.jpg'), require('./restaurant3.jpg')]
  const clickImage = (index) => {
    const imagePosition = { height: 100, width: 200, y: 60 + flatListPosition.y - offsetScroll, x: ((20 * (index) + 200 * index) - offsetScrollFlat) }
    navigation.navigate('Descricao', { imagePosition, image: images[index] })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView
        onScroll={(event) => setoffsetScroll(event.nativeEvent.contentOffset.y)}
        onLayout={({ nativeEvent }) => console.log(nativeEvent.layout)}
        style={{ marginTop: 60 }}>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <FlatList
          onScroll={(event) => setoffsetScrollFlat(event.nativeEvent.contentOffset.x)}
          onLayout={({ nativeEvent }) => setFlatListPosition(nativeEvent.layout)}
          contentContainerStyle={{ alignItems: 'center', }}
          horizontal={true}
          data={images}
          keyExtractor={(item, index) => index + ''}
          renderItem={({ item, index }) => (
            <View key={index} style={{ marginRight: 20 }}>
              <TouchableWithoutFeedback onPress={() => clickImage(index)}>
                <Image style={{ width: 200, height: 100 }} source={item} resizeMode={'cover'} />
              </TouchableWithoutFeedback>
            </View>
          )}
        />
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
        <Text style={{ marginBottom: 50 }}>SCROLL VIEW!</Text>
      </ScrollView>
    </View >
  );
}
const Stack = createStackNavigator()




export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animationEnabled: false }} >
        <Stack.Screen options={{ headerTransparent: true, headerTintColor: 'black' }} name="Home" component={SettingsScreen} />
        <Stack.Screen options={{ headerTransparent: true, headerTintColor: 'white' }} name="Descricao" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}