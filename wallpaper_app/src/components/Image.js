import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('window');

const ImageItem = (props) => {
  const [favorite, setFavorite] = useState(false);

  const {item} = props;

  const wallpaperState = {
    name: item.description,
    img: item.urls.regular,
  };

  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        setFavorite(!favorite);
        const res = await fetch(`http://10.0.2.2:3000/wallpapers/`, {
          method: 'POST',
          body: JSON.stringify(wallpaperState),
          headers: {'Content-type': 'application/json; charset=UTF-8'},
        });
        console.log('Guardado');
      }}>
      <View style={[{height, width}]}>
        <Image
          style={styles.images}
          source={{uri: item.urls.regular}}
          resizeMode="cover"></Image>
        <View style={styles.imageOverlay}>
          {favorite && <Ionicons name="ios-heart" color="red" size={60} />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ImageItem;

const styles = StyleSheet.create({
  images: {
    flex: 1,
    height: null,
    width: null,
  },

  imageOverlay: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
