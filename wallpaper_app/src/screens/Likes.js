import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';

const Likes = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [defaultAnimationDialog, setDefaultAnimationDialog] = useState(false);
  const [deletee, setDelete] = useState(0);

  useEffect(() => {
    retrieveWallpapers();
  }, []);

  const retrieveWallpapers = async () => {
    setLoading(true);
    await axios
      .get('http://10.0.2.2:3000/wallpapers/')
      .then(function (res) {
        setImages(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        console.log('Imagenes traidas de la api');
      });
  };

  const onRefresh = () => {
    setImages([]);
    setRefreshing(true);
    retrieveWallpapers();
  };

  const showMenu = ({item}) => {
    console.log(item.id);
    setDelete(item.id);
    setDefaultAnimationDialog(true);
  };

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyList}>
        <Text>The list is empty</Text>
      </View>
    );
  };

  const renderRow = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={() => showMenu({item})}>
        <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
          <Image style={styles.imageThumbnail} source={{uri: item.img}} />
          <SafeAreaView>
            <Dialog
              onDismiss={() => {
                setDefaultAnimationDialog(false);
              }}
              width={0.9}
              visible={defaultAnimationDialog}
              rounded
              actionsBordered
              dialogTitle={
                <DialogTitle
                  title="Delete"
                  style={{
                    backgroundColor: '#F7F7F8',
                  }}
                  hasTitleBar={false}
                  align="left"
                />
              }
              footer={
                <DialogFooter>
                  <DialogButton
                    text="CANCEL"
                    bordered
                    onPress={() => {
                      setDefaultAnimationDialog(false);
                    }}
                    key="button-1"
                  />
                  <DialogButton
                    text="OK"
                    bordered
                    onPress={async () => {
                      const res = await fetch(
                        `http://10.0.2.2:3000/wallpapers/${deletee}`,
                        {
                          method: 'DELETE',
                        },
                      );
                      console.log('Borrado de favoritos');
                      retrieveWallpapers();
                      setDefaultAnimationDialog(false);
                    }}
                    key="button-2"
                  />
                </DialogFooter>
              }>
              <DialogContent
                style={{
                  backgroundColor: '#F7F7F8',
                }}>
                <Text>Delete wallpaper from favorites</Text>
              </DialogContent>
            </Dialog>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favoritos</Text>
      <FlatList
        numColumns={2}
        data={images}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyContainer()}
        onEndReachedThreshold={0.5}
        onEndReached={() => !loading && retrieveWallpapers()}
        refreshing={refreshing}
        onRefresh={() => onRefresh()}></FlatList>
    </View>
  );
};
export default Likes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 400,
    borderRadius: 2,
  },
  emptyList: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginTop: 5,
  },
});
