import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Animated,
  TouchableOpacity,
  Share,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FileSystem, Permissions} from 'react-native-unimodules';
import CameraRoll from '@react-native-community/cameraroll';

import ImageItem from '../components/Image';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [scale, setScale] = useState(new Animated.Value(1));
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    retrieveWallpapers();
  }, []);

  const retrieveWallpapers = async () => {
    await axios
      .get(
        'https://api.unsplash.com/photos/random?count=30&client_id=VWy65HkEf3-gDzKm2lr3eLp8u751dAs262VmNBV32hs',
      )
      .then(function (res) {
        setImages(res.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        console.log('Finished');
      });
  };

  const showControls = (item) => {
    console.log(focus);
    setFocus(!focus),
      () => {
        if (focus) {
          Animated.spring(scale, {
            toValue: 0.8,
          }).start();
        } else {
          Animated.spring(scale, {
            toValue: 1,
          }).start();
        }
      };
  };

  const saveWallpaper = async (image) => {
    let cameraPermissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (cameraPermissions.status !== 'granted') {
      cameraPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    if (cameraPermissions.status === 'granted') {
      FileSystem.downloadAsync(
        image.urls.regular,
        FileSystem.documentDirectory + image.id + '.jpg',
      )
        .then(({uri}) => {
          CameraRoll.save(uri);
          alert('Saved');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('Require permission');
    }
  };

  const shareWallpaper = async (item) => {
    try {
      await Share.share({
        message: 'Image: ' + item.urls.full,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <ImageItem item={item}></ImageItem>
        <View style={styles.control}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => retrieveWallpapers()}>
              <Ionicons name="ios-refresh" color="white" size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => shareWallpaper(item)}>
              <Ionicons name="ios-share" color="white" size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => saveWallpaper(item)}>
              <Ionicons name="ios-save" color="white" size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return loading ? (
    <View style={styles.container}>
      <Text style={styles.text}>Wallpaper App</Text>
      <ActivityIndicator
        size="large"
        color="grey"
        style={styles.indicator}></ActivityIndicator>
    </View>
  ) : (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={!focus}
        horizontal
        pagingEnabled
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}></FlatList>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  indicator: {
    marginTop: 5,
  },
  control: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
