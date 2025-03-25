import * as THREE from 'three'
// 车轮材质
export const wheelMaterial:THREE.MeshPhysicalMaterial  = new THREE.MeshPhysicalMaterial({
  color: 'red',
  metalness: 1, // 金属度 0-1  0为非金属 1为金属
  roughness: 0, // 金属粗糙度 0-1  0为平滑 1为粗糙
  clearcoat: 1, // 清漆
  clearcoatRoughness: 0, // 清漆粗糙度
})

// 窗户材质
export const windowMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 'white',
  metalness: 0, // 金属度 0-1  0为非金属 1为金属
  roughness: 0.05, // 金属粗糙度 0-1  0为平滑 1为粗糙
  transmission: 1, // 透射率 0-1  0为不透明 1为透明 用于设置玻璃材质
  transparent: true, // 是否透明
  thickness: 0.1, // 玻璃厚度 用于设置玻璃材质
})

// 车身材质
export const bodyMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 'red',
  metalness: 1, // 金属度 0-1  0为非金属 1为金属
  roughness: 0, // 金属粗糙度 0-1  0为平滑 1为粗糙
  clearcoat: 1, // 清漆
  clearcoatRoughness: 0, // 清漆粗糙度
})

// 碳纤维材质
export const carbonMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({
  color: 'red',
  metalness: 1, // 金属度 0-1  0为非金属 1为金属
  roughness: 0, // 金属粗糙度 0-1  0为平滑 1为粗糙
  clearcoat: 1, // 清漆
  clearcoatRoughness: 0, // 清漆粗糙度
})

export const colors = [
  '#ffffff',
  '#000000',
  '#ff4500',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#c71585',
  'rgb(255, 120, 0)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
]

export const roughness = [
  {
    label: '磨砂',
    value: 1
  },
  {
    label: '冰晶',
    value: 0
  }
]