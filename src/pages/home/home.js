import React from 'react';
import background from '../../assets/background.png';

export default function Home() {

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <img alt='Plano de fundo SGOM' src={background} style={{width: '100%', height: '100%', resize: 'both'}} />
        </div>
    );
}