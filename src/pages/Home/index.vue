<template>
  <div class="container">
    <div class="container-3D" ref="container"></div>
    <div class="control">
      <h1>汽车展示与选配</h1>
      <h3>选择车身颜色</h3>
      <div class="color-container">
        <span :style="{backgroundColor: color}"
        v-for="(color, index) of colors" :key="index"
        @click="handleBodyColor(color)"
        >
        </span>
      </div>
      <h3>选择碳纤维颜色</h3>
      <div class="color-container">
        <span :style="{backgroundColor: color}"
        v-for="(color, index) of colors" :key="index"
        @click="handleCarbonColor(color)"
        >
        </span>
      </div>
      <h3>选择车轮颜色</h3>
      <div class="color-container">
        <span :style="{backgroundColor: color}"
        v-for="(color, index) of colors" :key="index"
        @click="handleWheelColor(color)"
        >
        </span>
      </div>
      <h3>选择车窗颜色</h3>
      <div class="color-container">
        <span :style="{backgroundColor: color}"
        v-for="(color, index) of colors" :key="index"
        @click="handleWindowColor(color)"
        >
        </span>
      </div>
      <h3>选择磨砂</h3>
      <div class="roughness-container">
        <span v-for="item of roughness" :key="item.value"
        @click="handleRoughness(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <input type="file" name="file" id="fileID">
      <el-button @click="toZip">sure</el-button>
    </div>
  </div>
  <div class="mask" v-if="hasMask">
    <h3 style="margin-bottom: 20px; color: #bbbfc8;">加载模型中</h3>
    <el-progress style="width: 400px;" :percentage="percentage" :stroke-width="15" striped striped-flow />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch, computed, getCurrentInstance} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import JSZip from "jszip";
import FileSaver from 'file-saver';
import {
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'
import JSZipUtils from 'jszip-utils'
import { useAppStore } from '@/store/appStore'
const appStore = useAppStore()
const instance = getCurrentInstance()
const appName = instance?.appContext.config.globalProperties?.$appName


import {
  wheelMaterial,
  windowMaterial,
  carbonMaterial,
  bodyMaterial,
  colors,
  roughness
} from './ts/enum'
import _ from 'lodash'
import gsap from 'gsap'
const container = ref<HTMLElement|null>(null)
const percentage = ref(0) // 加载进度条百分比
const hasMask = ref(true)
const appsState = ref<Record<string, any>>({})
const percentageColor = ref('#f56c6c')
const percentageWatch = watch(() => percentage.value, (val) => {
  if(val < 50) {
    percentageColor.value = '#f56c6c'
  } else if(val >=50 && val < 80) {
    percentageColor.value = '#e6a23c'
  } else if(val >=80 && val < 100) {
    percentageColor.value = '#909399'
  } else {
    percentageColor.value = '#67c23a'
    hasMask.value = false
    if(qiankunWindow.__POWERED_BY_QIANKUN__) {
      changeAppState()
    }
  }
})

// 各类模型数据分组
const wheels: THREE.Mesh[] = []
const windows: THREE.Mesh[] = []
const carbons: THREE.Mesh[] = []
const bodys: THREE.Mesh[] = []


// 创建场景
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  group: THREE.Group,
  observer: ResizeObserver | null


const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => {
  console.log(`Loading: ${loaded}/${total} files`);
  percentage.value = ~~(loaded / total * 100)
};

const appInfo = computed(() => {
 return appStore.getAppInfo
})
onMounted(async () => {

  if(container.value) {


    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#ccc')
    // scene.environment = new THREE.Color('#ccc')
    // 设置相机
    camera = new THREE.PerspectiveCamera(
      75,
      container.value?.clientWidth / container.value?.clientHeight,
      0.1,
      1000
    )
    camera.position.set(5, 3, 5)  // 必须设置相机位置，否则无法显示
    camera.aspect = container.value?.clientWidth / container.value?.clientHeight
    camera.updateProjectionMatrix()

    // 设置渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    })
    renderer.setSize(container.value?.clientWidth, container.value?.clientHeight)
    renderer.setClearColor('#000')
    renderer.setPixelRatio(window.devicePixelRatio)
    // 设置色调映射
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.shadowMap.enabled = true; // 开启阴影

    container.value?.appendChild(renderer.domElement)

    // 设置控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    group = new THREE.Group()
    // 添加一个三维坐标系
    const axesHelper = new THREE.AxesHelper(100)
    group.add(axesHelper)

    // 添加网格地面
    const gridHelper = new THREE.GridHelper(10, 10)
    gridHelper.material.opacity = 0.2
    gridHelper.material.transparent = true
    group.add(gridHelper)

    // 
    const DirectionalLight = new THREE.DirectionalLight(0xffffff, 10)
    const directionalLightHelper = new THREE.DirectionalLightHelper(DirectionalLight, 5)
    group.add(DirectionalLight, directionalLightHelper)

    // 加载模型
    
    const gltfLoader = new GLTFLoader(manager)
    // 这里的 工具类是配合jszip使用的，工具类读取zip数据，得到二进制数据流，存到 blob中，之后
    // threeJS 加载器loader去加载这个二进制数据就好了
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log(baseUrl, 'baseUrl');
    let url = ''
    if(import.meta.env.VITE_DEVELOPMENT === 'production') {
      // url = baseUrl + 'model/car/scene.gltf'
      url = baseUrl + 'model/new-car/car.zip'
    } else {
      // url = 'public/model/car/scene.gltf'
      url = 'public/model/new-car/car.zip'
    }
    console.log(url, 'url123123123');
    
    // JSZipUtils.getBinaryContent(url, (err, data) => { // 读取zip文件数据
    fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      console.log(data, '读取成功');
      const jszip = new JSZip(); // 实例化jszip
      // 读取成功，将数据存到blob中，然后加载
      jszip.loadAsync(data).then(function (res) {
        let fileList = res.files; // 获取zip文件中的所有文件
        for (let key in fileList) {
          jszip.file(key).async("arraybuffer").then((content) => {
            // Blob构造文件地址，通过url加载模型
            let blob = new Blob([content]);
            let modelUrl = URL.createObjectURL(blob);
            gltfLoader.load(modelUrl, (gltf: { scene: any; }) => {
            // 设置电光源
            const pointLight = new THREE.PointLight(0xffffff, 1)
            const carCube = gltf.scene
            carCube.traverse((child: THREE.Object3D<THREE.Object3DEventMap>) => {
                if(child.name.includes('Wheel')) {
                  // 找出轮子
                  child.traverse((item: THREE.Object3D<THREE.Object3DEventMap>) => {
                    if(item instanceof THREE.Mesh && item.material.name.includes('Wheel1A')) {
                      item.material = wheelMaterial
                      wheels.push(item)
                    }
                  })
                } else if(child.name.includes('WINDOW')) {
                  // 找出玻璃
                  child.traverse((item: THREE.Object3D<THREE.Object3DEventMap>) => {
                    if(item instanceof THREE.Mesh) {
                      item.material = windowMaterial
                      windows.push(item)
                    }
                  })
                  
                } else if(child.name.includes('carbon')) {
                  // 找出碳纤维
                  child.traverse((item: THREE.Object3D<THREE.Object3DEventMap>) => {
                    if(item instanceof THREE.Mesh) {
                      item.material = carbonMaterial
                      carbons.push(item)
                    }
                  })
                } else if(child.name.includes('12_T_Body') || child.name.includes('13_T_Body')) {
                  // 找出车身
                  child.traverse((item: THREE.Object3D<THREE.Object3DEventMap>) => {
                    if(item instanceof THREE.Mesh) {
                      item.material = bodyMaterial
                      bodys.push(item)
                    }
                  })
                } else if(child.name.includes('Dummy')) {
                  // 找出车翼等其他部分
                  child.traverse((item: THREE.Object3D<THREE.Object3DEventMap>) => {
                    if(item.name.includes('T_Body')) {
                      item.traverse((_item: THREE.Object3D<THREE.Object3DEventMap>) => {
                        if(_item instanceof THREE.Mesh) {
                          _item.material = bodyMaterial
                          bodys.push(_item)
                        } 
                      })
                    }
                  })
                } else if(child.name.includes('90_T_Body_0_166')) {
                  // 找出中间灯光板
                  child.traverse((item: THREE.Object3D<THREE.Object3DEventMap>) => {
                    if(item instanceof THREE.Mesh) {
                      item.material = bodyMaterial
                      bodys.push(item)
                    } 
                  })
                }
            })

            carCube.add(pointLight)
            carCube.scale.set(100, 100, 100)
            let options= {
              angle: 0
            }
            // 设置旋转动画
            gsap.to(options, {
              angle: 2 * Math.PI,
              duration: 30,
              repeat: -1,
              ease: 'linear',
              onUpdate: () => {
                carCube.rotation.y = options.angle
              }
            })
            group.add(carCube)
          }, (state: any) => {
            // 模型加载进度回调
            console.log(state, 'state');
            
            
          }, (error: any) => {
            console.log(error)
          })
            
          })
        }
        
      })
    })

    observer = new ResizeObserver(updateSize)
    observer.observe(container.value);

    scene.add(group)

    render()
  }
})
onUnmounted(() => {
  percentageWatch()
  observer?.disconnect()
  observer = null
})
const updateSize = _.debounce(() => {
  // 更新渲染器
  if(container.value) {
    renderer.setSize(container.value?.clientWidth, container.value?.clientHeight)
    // 更新相机的宽高比
    camera.aspect = container.value?.clientWidth / container.value?.clientHeight
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix()  // 一定要执行该方法
  }
})
function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

function handleBodyColor(color: string) {
  // 更换车身颜色
  bodyMaterial.color.set(color)
}
function handleCarbonColor(color: string) {
  // 更改碳纤维颜色
  carbonMaterial.color.set(color)
}
function handleWheelColor(color: string) {
  // 更换车轮颜色
  wheelMaterial.color.set(color)
}
function handleWindowColor(color: string) {
  // 更换车窗颜色
  windowMaterial.color.set(color)
}

// 更改磨砂度
function handleRoughness(value: number) {
  bodyMaterial.clearcoatRoughness = value
  bodyMaterial.roughness = value
  carbonMaterial.clearcoatRoughness = value
  carbonMaterial.roughness = value
}

function toZip() {
    var file = document.getElementById("fileID");
　　// 文件上传后 点击submit， 获取到上传文件
    var zip = new JSZip(); 
    zip.file(file.files[0].name, file.files[0]);
    //console.log(file.files[0]);
    zip.generateAsync({ // 这里可以看jszip官方文档
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    }).then(function (content) {
      // console.log(2);
      FileSaver(content, file.files[0].name.split('.')[0]+'.zip');
　　　　//到这里 就可以上传模型，自动会压缩并打包。
        console.log(content, 'dawfaevfeavaw');

    });
    //  if (false) {
    //     var content = "这里可以拿到接口返回的压缩包二进制数据,还原后解压";
    //     zip.loadAsync(content).then(function (zip) {
    //        new_zip.file("getContent.txt").async("string");
    //     });
    //  }
  }

// 修改子应用加载的loading状态
function changeAppState() {
  const { setGlobalState } = window[`__QIANKUN_PROPS__${appName}`] as Record<string, any>;
  appStore.changeKeyAppInfo('loading', false)
  setGlobalState({
    ...appsState.value,
    [appName]: {
      ...appInfo.value
    }
  })
}


</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .container-3D {
    width: 100%;
    height: 100%;
  }
  .control {
    position: absolute;
    top: 0;
    right: 50px;
    z-index: 1;
    .color-container {
      display: flex;
      padding: 5px 0 5px 0;
      span {
        display: inline-block;
        width: 35px;
        height: 35px;
        margin-right: 3px;
        border: 2px solid white;
        cursor: pointer;
      }
    }
    .roughness-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 110px;
      span {
        display: inline-block;
        width: 50px;
        height: 30px;
        border: 2px solid white;
        text-align: center;
        background: #40a0ff00;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: absolute;
  top: 0px;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)) !important;
  backdrop-filter: blur(25px) !important;
}

</style>