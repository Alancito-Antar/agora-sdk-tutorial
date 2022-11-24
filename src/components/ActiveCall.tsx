import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {RtcSurfaceView} from 'react-native-agora';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ActiveCall({
  localUid,
  remoteUid,
  isMute,
  onSwitchCameraPress,
  onMuteMicPress,
  onLeavePress,
}: {
  localUid: number;
  remoteUid: number;
  isMute: boolean;
  onMuteMicPress: () => void;
  onSwitchCameraPress: () => void;
  onLeavePress: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* Remote user preview */}
      {remoteUid !== 0 ? (
        <RtcSurfaceView
          canvas={{uid: remoteUid}}
          style={styles.remoteVideoView}
        />
      ) : (
        <View>
          <Text>Waiting for others to join</Text>
        </View>
      )}

      {/* Local user preview */}
      <RtcSurfaceView
        canvas={{uid: localUid}}
        style={
          remoteUid === 0
            ? styles.remoteVideoView
            : [styles.localVideoView, {bottom: insets.bottom + 100}]
        }
      />
      <View style={[styles.actionsContainer, {bottom: insets.bottom}]}>
        {/* Boton para silenciar */}
        <Pressable
          style={styles.actionButtonContainer}
          onPress={onMuteMicPress}>
          <Image
            style={styles.actionButtonImage}
            source={
              isMute
                ? require('../../assets/icons/ic_mute.png')
                : require('../../assets/icons/ic_unmute.png')
            }
            resizeMode="contain"
          />
        </Pressable>

        {/* Boton para cerrar la llamada */}
        <Pressable style={styles.leaveButtonContainer} onPress={onLeavePress}>
          <Image
            style={styles.leaveButtonImage}
            source={require('../../assets/icons/ic_phone.png')}
            resizeMode="contain"
          />
        </Pressable>

        {/* Boton para cambiar la camara */}
        <Pressable
          style={styles.actionButtonContainer}
          onPress={onSwitchCameraPress}>
          <Image
            style={styles.actionButtonImage}
            source={require('../../assets/icons/ic_camera.png')}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  localVideoView: {
    overflow: 'hidden',
    position: 'absolute',
    right: 10,
    height: 200,
    width: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  remoteVideoView: {
    flex: 1,
  },
  actionsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    bottom: 10,
    left: 0,
    right: 0,
  },
  leaveButtonContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 40,
    backgroundColor: 'red',
  },
  actionButtonContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#000000CC',
  },
  leaveButtonImage: {
    width: 35,
    height: 35,
    tintColor: 'white',
  },
  actionButtonImage: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
});
