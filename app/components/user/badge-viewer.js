import Component from '@glimmer/component';
import { action } from '@ember/object';
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class UserBadgeViewer extends Component {
  scene;
  camera;
  renderer;
  controls;

  @action
  didInsert(){
    const animate = () => {
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
      requestAnimationFrame(animate);
    };

    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0xedfff2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("viewer").appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    //this.camera.position.z = 10;
    this.camera.position.set( 0, 10, 12 );


    /// controles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.autoRotate = true;

    //lights
    const ambient = new THREE.AmbientLight(0x222222, 4);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 0, 6);
    this.scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(120, 130, -130);
    this.scene.add(light2);

    let modelUrl = `/assets/models/${this.args.badge.name}.glb`;
    const loader = new GLTFLoader();
    console.log(loader);
    loader.load(
      modelUrl,
      (gltf) => {
        console.log('adding gltf to scene');
        this.scene.add(gltf.scene);
        animate();
      }
    );
  }
}
