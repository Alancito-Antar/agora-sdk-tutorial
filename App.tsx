import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ActiveCall from './src/components/ActiveCall';
import InactiveoCall from './src/components/InactiveoCall';

const appId = '316f7b52673941e18159d01406be806d';
const channel = 'Zoom Teme Ante Nosotros';
const token =
  '007eJxTYJgeE5Pfa51jvLvjULxta3vXnmJpnX65F85fmfxFf7z2C1FgMDY0SzNPMjUyMze2NDFMNbQwNLVMMTA0MTBLSrUwMEtxf5ue3BDIyPD58QMmRgYIBPHFGaLy83MVQlJzUxUc80pSFfzyi/NLivKLGRgAc1klkg==';
const localUid = 0;

export default function App() {
  useKeepAwake();

  const agoraEngineRef = useRef<IRtcEngine>(); // Instancia de Agora

  const [isJoined, setIsJoined] = useState(false); // Indica si el usuario local se unio al canal
  const [isMute, setIsMute] = useState(false); // Indica si el usuario local se unio al canal

  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user

  const getPermission = async () => {
    if (Platform.OS !== 'android') {
      // El info.plist es el que se ocupara del lado de iOS
      return;
    }

    // Pedimos los premisos adecuados para Android
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  };

  const setupVideoSDKEngine = async () => {
    try {
      // Llamamos a los permisos
      await getPermission();

      // Le damos el valor a nuestra instancia de Agora
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          // Este es un listener que se ejecutara cada vez que nos conectemos a un canal correctamente.
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          // Este es un listener que nos dira cuando un usuario se conecta
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, _Uid) => {
          // Este es un listener que nos dira cuando un usuario se desconecta
          setRemoteUid(0);
          // const updatedUidsList = [...remoteUids];
          // const offlineUidIndex = updatedUidsList.findIndex(x => x === Uid);
          // updatedUidsList.slice(offlineUidIndex, 1);
          // setRemoteUids(updatedUidsList);
        },
        onError: (errorCode, msg) => {
          console.log('Error Code', errorCode);
          console.log('Mesasge:', msg);
        },
      });
      agoraEngine.initialize({
        appId,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (isJoined) {
      // Si ya nos encontramos en la llamada, no hacemos nada.
      return;
    }

    // Dejamos que la instancia de AGORA nos asigne el canal y nos una.
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(token, channel, localUid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    // Cuando deseamos salir del canal.
    try {
      agoraEngineRef.current?.leaveChannel();

      // setRemoteUids([]);
      setIsJoined(false);
      setIsMute(false);

      setRemoteUid(0);
    } catch (e) {
      console.log(e);
    }
  };

  const muteMic = () => {
    try {
      agoraEngineRef.current?.muteLocalAudioStream(!isMute);

      setIsMute(!isMute);
    } catch (e) {
      console.log(e);
    }
  };

  const switchCamera = () => {
    try {
      agoraEngineRef.current?.switchCamera();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Inicializamos el motor de Agora cuando inicia la app
    setupVideoSDKEngine();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(isJoined);
  }, [isJoined]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {isJoined ? (
          <ActiveCall
            localUid={localUid}
            remoteUid={remoteUid}
            isMute={isMute}
            onMuteMicPress={muteMic}
            onSwitchCameraPress={switchCamera}
            onLeavePress={leave}
          />
        ) : (
          <InactiveoCall onJoinChannelPress={join} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
