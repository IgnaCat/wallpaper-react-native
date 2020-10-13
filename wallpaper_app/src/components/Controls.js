import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Share,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import CameraRoll from '@react-native-community/cameraroll';

const Controls = (props) => {
  const { item } = props;

  const shareWallpaper = async (item) => {
    try {
      await Share.share({
        message: 'Image: ' + item.urls.full,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const saveWallpaper = async (item) => {
    let cameraPermissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (cameraPermissions.status !== 'granted') {
      cameraPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    if (cameraPermissions.status === 'granted') {
      const callback = (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        setState({
          downloadProgress: progress,
        });
      };
      const downloadResumable = FileSystem.createDownloadResumable(
        item.urls.regular,
        FileSystem.documentDirectory + item.id + '.jpg',
        {},
        callback
      );
      try {
        const { uri } = await downloadResumable.downloadAsync();
        CameraRoll.save(uri);
        alert('Save successfully');
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('Requiere permissions');
    }
  };

  return (
    <View style={styles.control}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => shareWallpaper(item)}
      >
        <Ionicons name="ios-share" color="white" size={30} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} onPress={() => saveWallpaper(item)}>
        <Ionicons name="ios-save" color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  control: {
    position: 'absolute',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
