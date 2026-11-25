import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLOR} from './Tiza';

// Filtros SVG compartidos: "tiza" da bordes irregulares y textura granulada
const FiltrosTiza: React.FC = () => (
	<svg width={0} height={0} style={{position: 'absolute'}}>
		<defs>
			<filter id="tiza" x="-5%" y="-5%" width="110%" height="110%">
				<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={4} result="ruido" />
				<feDisplacementMap in="SourceGraphic" in2="ruido" scale={5} xChannelSelector="R" yChannelSelector="G" result="desplazado" />
				<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={9} result="grano" />
				<feColorMatrix in="grano" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.85" result="mascara" />
				<feComposite in="desplazado" in2="mascara" operator="in" />
			</filter>
			<filter id="polvo">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={2} />
				<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 -0.45" />
			</filter>
			<filter id="manchas">
				<feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={3} seed={7} />
				<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -0.55" />
			</filter>
		</defs>
	</svg>
);

// Pizarra verde con marco de madera y bandeja de tizas
export const Pizarra: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(ellipse at 50% 40%, #35604a 0%, #264a39 55%, #1b3529 100%)',
			}}
		>
			<FiltrosTiza />
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				{/* restos de tiza borrada y polvo */}
				<rect width={1080} height={1920} filter="url(#manchas)" opacity={0.1} />
				<rect width={1080} height={1920} filter="url(#polvo)" opacity={0.07} />
			</svg>
			<AbsoluteFill
				style={{
					border: '30px solid #7b4f2c',
					boxShadow:
						'inset 0 0 0 6px #5e3a1f, inset 0 0 60px rgba(0,0,0,0.55)',
				}}
			/>
			<BandejaTizas />
		</AbsoluteFill>
	);
};

const BandejaTizas: React.FC = () => {
	const tizas: [number, string][] = [
		[720, COLOR.blanco],
		[800, COLOR.rosa],
		[865, COLOR.amarillo],
	];
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: 30,
					right: 30,
					bottom: 30,
					height: 34,
					background: 'linear-gradient(#946238, #6d4423)',
					boxShadow: '0 -4px 10px rgba(0,0,0,0.35)',
				}}
			/>
			{tizas.map(([x, color]) => (
				<div
					key={x}
					style={{
						position: 'absolute',
						left: x,
						bottom: 50,
						width: 58,
						height: 16,
						borderRadius: 8,
						background: color,
						opacity: 0.9,
						rotate: '-3deg',
					}}
				/>
			))}
		</>
	);
};
