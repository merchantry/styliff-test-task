import ReactDOM from 'react-dom';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import './styles.css';
import { OrbitControls, Sphere, Stats } from '@react-three/drei';
import { App } from './App';

ReactDOM.render(
    <>
        <App />
    </>,
    document.getElementById('root')
);
