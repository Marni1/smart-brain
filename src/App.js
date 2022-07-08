
import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceR from './components/FaceR/FaceR';
import Rank from './components/Rank/Rank';
import { Component } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";



const particlesInit = async (main) => {
  console.log(main);

  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  // starting from v2 you can add only the features you need reducing the bundle size
  await loadFull(main);
};

const particlesLoaded = (container) => {
  console.log(container);
};
const poptions = {
  
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
      
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },

  },
  detectRetina: true,
}
  
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name:'',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
    
  }



  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name:data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})

  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch(`'https://still-badlands-71293.herokuapp.com/imageurl`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input   
})
})
.then(response => response.json())
      .then(response => {
        if(response){
          fetch(`'https://still-badlands-71293.herokuapp.com/image`, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
              
      })
    })
      .then(response=> response.json())
      .then(count =>  {
        this.setState(Object.assign(this.state.user, { entries: count}))
        })
      .catch(console.log)
      }
        this.displayFaceBox(this.calculateFaceLocation(response))
    })
    
      
        .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route==='home') {
    this.setState({isSignedIn: true})
    
  }
  this.setState({route: route})
  }


 
render(){
 const {isSignedIn, imageUrl, route, box} = this.state;
 

  return (
    <div className="App">
      <Particles
      className='tsparticles'
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={poptions}
    />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route ==='home'
      ?<div>
        <Logo />
        <Rank userName={this.state.user.name} userEntries={this.state.user.entries}/>
        <ImageLinkForm 
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit}/>
        <FaceR 
        box={box} 
        imageUrl={imageUrl}/>
       </div>
      
      :(
        route === 'signin'
      
      ?<Signin  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
     
      )
      }
    </div>
  );
  }
}
export default App;
