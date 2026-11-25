import React from 'react';
import type {Caption} from '@remotion/captions';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, fuenteManuscrita} from './Tiza';

type Props = {
	readonly palabras: Caption[];
};

// Subtítulos tipo karaoke: se muestra la oración completa en tiza blanca y la
// palabra que se está diciendo se resalta en tiza amarilla.
export const Karaoke: React.FC<Props> = ({palabras}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ms = (frame / fps) * 1000;

	return (
		<AbsoluteFill
			style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150}}
		>
			<div
				style={{
					width: 920,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: 34,
					rowGap: 2,
					fontFamily: fuenteManuscrita,
					fontSize: 88,
					lineHeight: 1.15,
					filter: 'url(#tiza)',
					opacity: interpolate(frame, [0, 6], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				{palabras.map((p, i) => {
					const siguiente = palabras[i + 1];
					const fin = siguiente ? siguiente.startMs : p.endMs;
					const activa = ms >= p.startMs && ms < fin;
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								color: activa ? COLOR.amarillo : COLOR.blanco,
								textShadow: activa ? '0 0 22px rgba(247,226,124,0.5)' : 'none',
								scale: activa
									? interpolate(ms, [p.startMs, p.startMs + 140], [1.1, 1.04], {
											extrapolateLeft: 'clamp',
											extrapolateRight: 'clamp',
										})
									: 1,
							}}
						>
							{p.text.trim()}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
