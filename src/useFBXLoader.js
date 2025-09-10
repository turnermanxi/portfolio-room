// useFBXLoader.js
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'

export default function useFBX(path) {
  return useLoader(FBXLoader, path)
}
