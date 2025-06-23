export const checkCameraSupport = (): boolean => {
  return !!(
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia &&
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  );
};

export const requestCameraPermission = async (): Promise<MediaStream | null> => {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 }
      },
      audio: false
    };

    console.log('Requesting camera with constraints:', constraints);
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Log stream info for debugging
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      console.log('Camera settings:', videoTrack.getSettings());
      console.log('Camera capabilities:', videoTrack.getCapabilities());
    }
    
    return stream;
  } catch (error: any) {
    console.error('Camera access error:', error);
    
    // Try fallback constraints if the ideal ones fail
    if (error.name === 'OverconstrainedError' || error.name === 'NotSupportedError') {
      try {
        console.log('Trying fallback camera constraints...');
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        return fallbackStream;
      } catch (fallbackError) {
        console.error('Fallback camera access failed:', fallbackError);
        return null;
      }
    }
    
    return null;
  }
};

export const stopCamera = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => {
      console.log('Stopping camera track:', track.kind);
      track.stop();
    });
  }
};

export const checkARSupport = (): boolean => {
  // Check if device supports WebRTC and has camera
  const hasCamera = checkCameraSupport();
  const hasWebGL = !!(window.WebGLRenderingContext || window.WebGL2RenderingContext);
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  
  return hasCamera && hasWebGL && isSecure;
};

export const getCameraDevices = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error getting camera devices:', error);
    return [];
  }
};

export const switchCamera = async (currentFacingMode: 'user' | 'environment'): Promise<MediaStream | null> => {
  const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: newFacingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    
    return stream;
  } catch (error) {
    console.error('Error switching camera:', error);
    return null;
  }
};