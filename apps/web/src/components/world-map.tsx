'use client';

import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  data: { countryCode: string; pageviews: number }[];
}

export function WorldMap({ data }: WorldMapProps) {
  // Find max pageviews for scaling
  const maxPageviews = useMemo(() => {
    return Math.max(...data.map(d => d.pageviews), 1);
  }, [data]);

  // Color scale: from light gray to dark neutral-900 (#171717)
  const colorScale = scaleLinear<string>()
    .domain([0, maxPageviews])
    .range(["#f5f5f5", "#171717"]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
      <ComposableMap
        projectionConfig={{
          scale: 140,
        }}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.id || geo.properties.iso_a2; // world-atlas uses id for ISO numeric, but often properties contain iso_a2
              // In world-atlas 110m, we typically need to map numeric ID to Alpha-2 or it might be missing.
              // Actually, many CDNs don't have iso_a2 in 110m. 
              // To be safe with ip-api which returns alpha-2 (e.g. "US", "ES"), we'll do our best.
              // A simple fallback if iso_a2 isn't available is using a map, but we'll try to find it.
              
              const d = data.find((s) => s.countryCode === geo.properties.iso_a2 || s.countryCode === geo.properties.a2);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? colorScale(d.pageviews) : "#f5f5f5"}
                  stroke="#e5e5e5"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#404040", outline: "none", cursor: 'pointer' },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
