import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {
	Bicarbonato,
	Botella,
	Colorante,
	Cuchara,
	Flecha,
	Jabon,
	Plastilina,
	Vinagre,
	Volcan,
} from './Dibujos';
import {avance, circulo, COLOR, Escrito, Etiqueta, Trazo} from './Tiza';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Lienzo SVG del tamaño del video, con el filtro de tiza aplicado
const Lienzo: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
	<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute'}}>
		<g filter="url(#tiza)">{children}</g>
	</svg>
);

const DESTELLO = 'M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z';

// Destellos que parpadean
const Destellos: React.FC<{readonly inicio: number; readonly puntos: [number, number][]}> = ({
	inicio,
	puntos,
}) => {
	const frame = useCurrentFrame();
	return (
		<>
			{puntos.map(([x, y], i) => {
				const t = frame - inicio - i * 3;
				if (t < 0) {
					return null;
				}
				const s = interpolate(t, [0, 6], [0, 1], {...clamp, easing: Easing.out(Easing.back(3))}) *
					(0.8 + 0.25 * Math.sin(t / 3 + i));
				return (
					<path
						key={i}
						d={DESTELLO}
						transform={`translate(${x} ${y}) scale(${s})`}
						fill={COLOR.amarillo}
						opacity={0.9}
					/>
				);
			})}
		</>
	);
};

// ======================= Escena 1: título =======================
export const Escena1: React.FC = () => {
	const frame = useCurrentFrame();
	// pequeño rebote del volcán cuando termina de dibujarse
	const rebote = frame > 92 ? 1 + 0.035 * Math.sin((frame - 92) / 3) * Math.exp(-(frame - 92) / 25) : 1;
	return (
		<AbsoluteFill>
			<Escrito
				inicio={4}
				duracion={18}
				style={{top: 190, left: '50%', translate: '-50% 0', fontSize: 150, color: COLOR.blanco}}
			>
				¡Hagamos
			</Escrito>
			<Escrito
				inicio={22}
				duracion={20}
				style={{top: 370, left: '50%', translate: '-50% 0', fontSize: 150, color: COLOR.blanco}}
			>
				un <span style={{color: COLOR.amarillo}}>volcán!</span>
			</Escrito>
			<Lienzo>
				<Trazo d="M230 640 Q330 612 430 640 T630 640 T830 640" color={COLOR.rosa} ancho={9} inicio={40} duracion={10} />
				<g transform={`translate(230 830) translate(310 446) scale(1 ${rebote}) translate(-310 -446)`}>
					<Volcan id="volcan-1" inicio={44} d={48} cara color={COLOR.marron} />
					<Trazo d="M300 -40 q-34 -26 -4 -58 q20 -38 58 -14 q40 -8 36 32 q22 34 -24 44" color={COLOR.blanco} ancho={6} inicio={88} duracion={10} />
				</g>
				<Destellos inicio={96} puntos={[[170, 900], [910, 960], [140, 1180], [950, 1200], [800, 760]]} />
			</Lienzo>
		</AbsoluteFill>
	);
};

// ======================= Escena 2: materiales =======================
const CELDAS: [number, number][] = [
	[290, 470],
	[790, 470],
	[290, 830],
	[790, 830],
	[290, 1190],
	[790, 1190],
];

export const Escena2: React.FC = () => {
	const inicios = [12, 36, 60, 84, 104, 120];
	const nombres = ['botella', 'plastilina', 'bicarbonato', 'vinagre', 'colorante rojo', 'jabón'];
	const dibujos = [Botella, Plastilina, Bicarbonato, Vinagre, Colorante, Jabon];
	return (
		<AbsoluteFill>
			<Escrito
				inicio={2}
				duracion={12}
				style={{top: 130, left: '50%', translate: '-50% 0', fontSize: 100, color: COLOR.amarillo}}
			>
				Materiales
			</Escrito>
			<Lienzo>
				{dibujos.map((Dibujo, i) => (
					<g key={nombres[i]} transform={`translate(${CELDAS[i][0]} ${CELDAS[i][1] - 30}) scale(0.82)`}>
						<Dibujo inicio={inicios[i]} d={16} />
					</g>
				))}
			</Lienzo>
			{nombres.map((nombre, i) => (
				<Etiqueta
					key={nombre}
					inicio={inicios[i] + 10}
					style={{left: CELDAS[i][0] - 220, width: 440, textAlign: 'center', top: CELDAS[i][1] + 100}}
				>
					{nombre}
				</Etiqueta>
			))}
		</AbsoluteFill>
	);
};

// ======================= Escena 3: paso 1 =======================
// puntos de la superficie del volcán (escala 1.2 en translate(168, 700))
const BOLITAS: [number, number, number, number][] = [
	// destino x, y, origen x, y
	[300, 1150, -80, 1300],
	[380, 960, -60, 820],
	[450, 820, 200, -60],
	[540, 1060, 540, 2000],
	[630, 820, 880, -60],
	[700, 960, 1140, 820],
	[780, 1150, 1160, 1300],
	[540, 900, 1140, 1100],
];

const Bolitas: React.FC<{readonly inicio: number}> = ({inicio}) => {
	const frame = useCurrentFrame();
	return (
		<>
			{BOLITAS.map(([x1, y1, x0, y0], i) => {
				const p = avance(frame, inicio + i * 2, 12);
				if (p <= 0) {
					return null;
				}
				return (
					<circle
						key={i}
						cx={x0 + (x1 - x0) * p}
						cy={y0 + (y1 - y0) * p}
						r={30}
						fill={COLOR.marron}
						stroke={COLOR.marron}
						strokeWidth={6}
						fillOpacity={0.6}
						opacity={interpolate(frame, [inicio + 30, inicio + 44], [1, 0], clamp)}
					/>
				);
			})}
		</>
	);
};

export const Escena3: React.FC = () => (
	<AbsoluteFill>
		<Escrito inicio={4} duracion={14} style={{top: 160, left: '50%', translate: '-50% 0', fontSize: 130, color: COLOR.amarillo}}>
			Paso 1
		</Escrito>
		<Lienzo>
			<g transform="translate(540 961) scale(1.5)">
				<Botella inicio={8} d={18} />
			</g>
			<Bolitas inicio={24} />
			<g transform="translate(168 700) scale(1.2)">
				<Volcan id="volcan-3" inicio={36} d={50} />
			</g>
			<Flecha inicio={66} d={16} linea="M400 340 Q240 560 310 870" punta="M268 836 L312 878 L346 828" />
		</Lienzo>
		<Etiqueta inicio={74} style={{top: 470, left: 90, fontSize: 56}}>
			¡cúbrela!
		</Etiqueta>
	</AbsoluteFill>
);

// ======================= Escena 4: paso 2 =======================
const CRATER = 'M408 736 Q540 792 672 736 Q540 704 408 736 Z';
const GOTA = 'M0 -24 C-12 -6 -10 8 0 8 C10 8 12 -6 0 -24 Z';

const Ingredientes: React.FC = () => {
	const frame = useCurrentFrame();
	// cuchara de bicarbonato
	const xCuchara = interpolate(frame, [18, 28], [-250, 560], {...clamp, easing: Easing.out(Easing.quad)});
	const giroCuchara = interpolate(frame, [30, 38], [0, 35], clamp);
	// gotas de colorante y jabón
	const gotasRojas = [58, 63, 68];
	const gotasJabon = [78, 81, 84];
	return (
		<>
			{/* el interior del cráter cambia de color con cada ingrediente */}
			<path d={CRATER} fill={COLOR.blanco} opacity={interpolate(frame, [36, 50], [0, 0.6], clamp)} />
			<path d={CRATER} fill={COLOR.rojo} opacity={interpolate(frame, [62, 76], [0, 0.8], clamp)} />

			<g
				transform={`translate(${xCuchara} 600) rotate(${giroCuchara})`}
				opacity={interpolate(frame, [50, 56], [1, 0], clamp)}
			>
				<Cuchara inicio={18} d={8} />
			</g>
			{Array.from({length: 14}).map((_, i) => {
				const t0 = 34 + i;
				const p = interpolate(frame, [t0, t0 + 9], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
				if (frame < t0 || p >= 1) {
					return null;
				}
				const x = 565 + (random(`polvo-${i}`) - 0.5) * 50;
				return <circle key={i} cx={x - 20 * p} cy={612 + 124 * p} r={6} fill={COLOR.blanco} />;
			})}

			<g transform="translate(650 470) rotate(180) scale(0.8)" opacity={interpolate(frame, [86, 92], [1, 0], clamp)}>
				<Colorante inicio={50} d={10} gota={false} />
			</g>
			{gotasRojas.map((t0) => {
				const p = interpolate(frame, [t0, t0 + 8], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
				if (frame < t0 || p >= 1) {
					return null;
				}
				return <path key={t0} d={GOTA} transform={`translate(${650 - 15 * p} ${560 + 176 * p})`} fill={COLOR.rojo} />;
			})}

			<g transform="translate(330 560) scale(0.75)">
				<Jabon inicio={70} d={10} />
			</g>
			{gotasJabon.map((t0) => {
				const p = interpolate(frame, [t0, t0 + 8], [0, 1], clamp);
				if (frame < t0 || p >= 1) {
					return null;
				}
				// chorrito en arco desde la bomba hasta el cráter
				return (
					<path
						key={t0}
						d={GOTA}
						transform={`translate(${366 + 150 * p} ${476 + 260 * p * p - 80 * Math.sin(Math.PI * p)})`}
						fill={COLOR.rosa}
					/>
				);
			})}
			{/* burbujitas de jabón saliendo del cráter */}
			{Array.from({length: 7}).map((_, i) => {
				const t = frame - (84 + i * 1.5);
				if (t < 0) {
					return null;
				}
				const x = 470 + random(`bj-${i}`) * 140 + 10 * Math.sin(t / 3 + i);
				return (
					<path
						key={i}
						d={circulo(x, 720 - t * 7, 9 + (i % 3) * 5)}
						fill="none"
						stroke={i % 2 ? COLOR.rosa : COLOR.azul}
						strokeWidth={5}
					/>
				);
			})}
		</>
	);
};

export const Escena4: React.FC = () => (
	<AbsoluteFill>
		<Escrito inicio={2} duracion={12} style={{top: 160, left: '50%', translate: '-50% 0', fontSize: 130, color: COLOR.amarillo}}>
			Paso 2
		</Escrito>
		<Lienzo>
			<g transform="translate(168 700) scale(1.2)">
				<Volcan id="volcan-4" inicio={0} d={22} />
			</g>
			<Ingredientes />
		</Lienzo>
		<Etiqueta inicio={22} fin={50} style={{top: 410, left: 110}}>
			bicarbonato
		</Etiqueta>
		<Etiqueta inicio={54} style={{top: 340, left: 730}}>
			colorante
		</Etiqueta>
		<Etiqueta inicio={72} style={{top: 360, left: 250}}>
			jabón
		</Etiqueta>
	</AbsoluteFill>
);

// ======================= Escena 5: ¡erupción! =======================
const ERUPCION = 52; // frame en el que empieza la erupción

const ESPUMA: [number, number, number, string, number][] = [
	// x, y, radio, color, retraso
	[640, 800, 62, COLOR.rojo, 0],
	[585, 760, 52, COLOR.naranja, 3],
	[700, 755, 56, COLOR.rojo, 5],
	[640, 700, 72, COLOR.naranja, 8],
	[560, 680, 48, COLOR.rojo, 11],
	[725, 670, 54, COLOR.naranja, 13],
	[640, 600, 62, COLOR.rojo, 16],
	[595, 530, 42, COLOR.naranja, 19],
	[690, 525, 46, COLOR.rojo, 21],
];

const Espuma: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			{ESPUMA.map(([x, y, r, color, retraso], i) => {
				const t = frame - ERUPCION - retraso;
				if (t < 0) {
					return null;
				}
				const s =
					interpolate(t, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(2.2))}) *
					(1 + 0.04 * Math.sin(t / 4 + i));
				return (
					<g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
						<circle r={r} fill={color} fillOpacity={0.4} stroke={color} strokeWidth={9} />
					</g>
				);
			})}
		</>
	);
};

const Burbujas: React.FC<{readonly inicio: number}> = ({inicio}) => {
	const frame = useCurrentFrame();
	const colores = [COLOR.blanco, COLOR.rosa, COLOR.azul, COLOR.amarillo];
	return (
		<>
			{Array.from({length: 18}).map((_, i) => {
				const t = frame - inicio - i * 3;
				if (t < 0) {
					return null;
				}
				const r = 10 + random(`r-${i}`) * 18;
				// pequeña simulación: salen del cráter, caen y rebotan en el suelo
				let x = 640 + (random(`x-${i}`) - 0.5) * 60;
				let y = 640;
				let vx = (random(`vx-${i}`) - 0.5) * 16;
				let vy = -(14 + random(`vy-${i}`) * 12);
				for (let k = 0; k < t; k++) {
					x += vx;
					y += vy;
					vy += 1;
					if (y > 1235 - r) {
						y = 1235 - r;
						vy = -vy * 0.62;
					}
					if (x < 80 + r || x > 1000 - r) {
						vx = -vx;
					}
				}
				return (
					<circle
						key={i}
						cx={x}
						cy={y}
						r={r}
						fill="none"
						stroke={colores[i % colores.length]}
						strokeWidth={5}
						opacity={interpolate(t, [60, 80], [1, 0], clamp)}
					/>
				);
			})}
		</>
	);
};

const Nino: React.FC<{readonly inicio: number}> = ({inicio}) => {
	const frame = useCurrentFrame();
	// aplaude: las manos se separan y se juntan
	const s = frame > inicio + 26 ? 8 + 26 * Math.abs(Math.sin((Math.PI * (frame - inicio - 26)) / 7.5)) : 30;
	return (
		<>
			<Trazo d={circulo(175, 1010, 52)} color={COLOR.blanco} inicio={inicio} duracion={6} relleno={COLOR.rosa} opacidadRelleno={0.25} />
			<Trazo d="M126 995 Q138 940 175 956 Q205 936 224 990" color={COLOR.amarillo} ancho={10} inicio={inicio + 5} duracion={4} />
			<Trazo d={circulo(158, 1006, 6)} color={COLOR.blanco} ancho={8} inicio={inicio + 9} duracion={2} />
			<Trazo d={circulo(192, 1006, 6)} color={COLOR.blanco} ancho={8} inicio={inicio + 10} duracion={2} />
			<Trazo d="M150 1030 Q175 1056 200 1030" color={COLOR.blanco} ancho={7} inicio={inicio + 11} duracion={3} />
			<Trazo d="M175 1062 L175 1160" color={COLOR.azul} ancho={14} inicio={inicio + 13} duracion={4} />
			<Trazo d="M175 1160 L140 1238 M175 1160 L210 1238" color={COLOR.blanco} ancho={10} inicio={inicio + 16} duracion={5} />
			{/* brazos hacia arriba, aplaudiendo sobre la cabeza */}
			<Trazo d={`M175 1088 Q100 1060 ${175 - s} 930`} color={COLOR.blanco} ancho={10} inicio={inicio + 20} duracion={3} />
			<Trazo d={`M175 1088 Q250 1060 ${175 + s} 930`} color={COLOR.blanco} ancho={10} inicio={inicio + 22} duracion={3} />
			{frame > inicio + 26 && s < 14 ? (
				<Trazo d="M150 905 L135 885 M200 905 L215 885 M175 900 L175 878" color={COLOR.amarillo} ancho={6} inicio={0} duracion={1} />
			) : null}
		</>
	);
};

export const Escena5: React.FC = () => {
	const frame = useCurrentFrame();
	const temblor =
		frame >= ERUPCION && frame < ERUPCION + 30
			? (random(`temblor-${frame}`) - 0.5) * 12 * (1 - (frame - ERUPCION) / 30)
			: 0;
	const xBotella = interpolate(frame, [4, 16], [1250, 800], {...clamp, easing: Easing.out(Easing.quad)});
	const giroBotella = interpolate(frame, [18, 30], [0, -120], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<AbsoluteFill>
			<Lienzo>
				<g transform={`translate(${330 + temblor} 800)`}>
					<Volcan id="volcan-5" inicio={0} d={14} />
				</g>
				<g
					transform={`translate(${xBotella} 560) rotate(${giroBotella}) scale(1.3)`}
					opacity={interpolate(frame, [58, 66], [1, 0], clamp)}
				>
					<Vinagre inicio={4} d={6} />
				</g>
				<g opacity={interpolate(frame, [54, 60], [1, 0], clamp)}>
					<Trazo d="M620 670 Q628 750 640 825" color={COLOR.amarillo} ancho={14} inicio={30} duracion={8} />
				</g>
				{/* rayos de la explosión */}
				<g opacity={interpolate(frame, [ERUPCION + 10, ERUPCION + 18], [1, 0], clamp)}>
					{Array.from({length: 9}).map((_, i) => {
						const a = Math.PI * (1.1 + (0.8 * i) / 8);
						return (
							<Trazo
								key={i}
								d={`M${640 + Math.cos(a) * 110} ${800 + Math.sin(a) * 110} L${640 + Math.cos(a) * 300} ${800 + Math.sin(a) * 300}`}
								color={COLOR.amarillo}
								ancho={9}
								inicio={ERUPCION}
								duracion={6}
							/>
						);
					})}
				</g>
				{/* lava bajando por las laderas del volcán */}
				<g transform={`translate(${temblor} 0)`}>
					<Trazo d="M548 834 C498 944 422 1098 362 1232" color={COLOR.rojo} ancho={34} inicio={ERUPCION + 6} duracion={26} />
					<Trazo d="M732 834 C782 944 858 1098 918 1232" color={COLOR.rojo} ancho={34} inicio={ERUPCION + 8} duracion={26} />
					<Trazo d="M565 838 C540 900 510 960 498 1000" color={COLOR.naranja} ancho={20} inicio={ERUPCION + 10} duracion={16} />
					<Trazo d="M715 838 C740 900 770 960 782 1000" color={COLOR.naranja} ancho={20} inicio={ERUPCION + 12} duracion={16} />
					<Trazo d="M640 840 C648 870 632 900 640 930" color={COLOR.naranja} ancho={20} inicio={ERUPCION + 14} duracion={10} />
				</g>
				<Espuma />
				<Burbujas inicio={ERUPCION + 2} />
				<g transform="translate(175 1238) scale(1.3) translate(-175 -1238)">
					<Nino inicio={68} />
				</g>
				<Destellos inicio={ERUPCION + 20} puntos={[[400, 520], [880, 600], [300, 760], [960, 420], [520, 380]]} />
			</Lienzo>
		</AbsoluteFill>
	);
};
