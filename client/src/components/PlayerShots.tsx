import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import wnbaHalfCourtImage from '../assets/wnba-half-court-black.png';

interface Shot {
    loc_x: number;
    loc_y: number;
    game_id: string;
    shot_made: number;
}

function PlayerShots() {
    const { playerId } = useParams<{ playerId: string }>();
    const [shots, setShots] = useState<Shot[]>([]);
    const [view, setView] = useState<'heatmap' | 'shotplot'>('shotplot');
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
    const [hasError, setHasError] = useState(false);
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const fetchShots = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/player/${playerId}/shots`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }
                const data: Shot[] = await response.json();
                if (data.length===0) {
                    setHasError(true);
                } else {
                    setShots(data);
                    setHasError(false);
                }
            } catch (error) {
                console.error('Error fetching player shots:', error);
                setHasError(true);
            }
        };

        fetchShots();
    }, [playerId]);

    useEffect(() => {
        if (shots.length > 0) {
            if (view === 'heatmap') {
                drawHeatMap(shots);
            } else {
                drawShotPlot(shots);
            }
        }
    }, [shots, view]);

    useEffect(() => {
        function setTabPosition() {
            const currentTab = tabsRef.current[activeTabIndex];
            if (currentTab) {
                setTabUnderlineLeft(currentTab.offsetLeft);
                setTabUnderlineWidth(currentTab.clientWidth);
            }
        }

        setTabPosition();
        window.addEventListener('resize', setTabPosition);

        return () => window.removeEventListener('resize', setTabPosition);
    }, [activeTabIndex]);

    const drawHeatMap = (shots: Shot[]) => {
        const svg = d3.select('#heatmap')
            .attr('viewBox', '-250 -47.5 500 470')
            .attr('preserveAspectRatio', 'xMinYMin');

        svg.selectAll('*').remove(); // Clear previous elements

        // Calculate scale for x and y coordinates
        const xScale = d3.scaleLinear()
            .domain([-250, 250]) // Standardized court dimensions
            .range([-250, 250]);

        const yScale = d3.scaleLinear()
            .domain([-47.5, 422.5]) // Standardized court dimensions
            .range([-47.5, 422.5]);

        // Prepare the data for density calculation
        const densityData = d3.contourDensity<Shot>()
            .x(d => xScale(d.loc_x))
            .y(d => yScale(d.loc_y))
            .size([500, 470])
            .bandwidth(85)
            (shots);

        const maxDensityValue = d3.max(densityData, d => d.value) as number;
        const colorScale = d3.scaleSequential(d3.interpolateRgb('white', '#FA4D00'))
            .domain([0, maxDensityValue]);

        // Draw the contour plot
        svg.append('g')
            .selectAll('path')
            .data(densityData)
            .enter().append('path')
            .attr('fill', d => colorScale(d.value))
            .attr('stroke', 'none')
            .attr('d', d3.geoPath() as any);

        // Add the court background image
        svg.append('image')
            .attr('x', -250)
            .attr('y', -47.5)
            .attr('width', 500)
            .attr('height', 470)
            .attr('href', wnbaHalfCourtImage);

        // Draw all shots as yellow circles
        svg.selectAll('.shot')
            .data(shots)
            .enter()
            .append('circle')
            .attr('class', 'shot')
            .attr('cx', d => xScale(d.loc_x))
            .attr('cy', d => yScale(d.loc_y))
            .attr('r', 3)
            .attr('fill', 'yellow')
            .attr('stroke', 'none');
    };

    const drawShotPlot = (shots: Shot[]) => {
        const svg = d3.select('#heatmap')
            .attr('viewBox', '-250 -47.5 500 470')
            .attr('preserveAspectRatio', 'xMinYMin');

        svg.selectAll('*').remove(); // Clear previous elements

        // Add the court background image
        svg.append('image')
            .attr('x', -250)
            .attr('y', -47.5)
            .attr('width', 500)
            .attr('height', 470)
            .attr('href', wnbaHalfCourtImage);

        // Calculate scale for x and y coordinates
        const xScale = d3.scaleLinear()
            .domain([-250, 250]) // Standardized court dimensions
            .range([-250, 250]);

        const yScale = d3.scaleLinear()
            .domain([-47.5, 422.5]) // Standardized court dimensions
            .range([-47.5, 422.5]);

        const shotsGroup = svg.append('g')
            .attr('class', 'shotplot__shots');

        // Plot green circles and red exes for shots made and shots missed
        shotsGroup.selectAll('g.shotplot__shot')
            .data(shots)
            .enter()
            .append('g')
            .attr('class', 'shotplot__shot')
            .attr('transform', d => `translate(${xScale(d.loc_x)}, ${yScale(d.loc_y)})`)
            .each(function (d) {
                const group = d3.select(this);
                if (d.shot_made) {
                    group.append('circle')
                        .attr('r', 5)
                        .attr('fill', 'none')
                        .attr('stroke', 'green')
                        .attr('stroke-width', 2);
                } else {
                    group.append('line')
                        .attr('x1', -4)
                        .attr('x2', 4)
                        .attr('y1', -4)
                        .attr('y2', 4)
                        .attr('stroke', 'red')
                        .attr('stroke-width', 2)
                        .attr('stroke-linecap', 'round');
                    group.append('line')
                        .attr('x1', 4)
                        .attr('x2', -4)
                        .attr('y1', -4)
                        .attr('y2', 4)
                        .attr('stroke', 'red')
                        .attr('stroke-width', 2)
                        .attr('stroke-linecap', 'round');
                }
            });
    };

    const handleTabClick = (index: number, viewType: 'heatmap' | 'shotplot') => {
        setActiveTabIndex(index);
        setView(viewType);
    };

    if (hasError) {
        return;
    }

    return (
        <div className='mt-10 mb-10'>
            <h1 className='font-bold text-2xl md:text-4xl mb-4'>Shooting</h1>
            <div className="mb-4 relative">
                <div className='flex gap-4'>
                    <button
                        className="py-2 mr-2 text-wOrange font-bold text-sm"
                        ref={(el) => (tabsRef.current[0] = el)}
                        onClick={() => handleTabClick(0, 'shotplot')}
                    >
                        SHOT PLOT
                    </button>
                    <button
                        className="py-2 text-wOrange font-bold text-sm"
                        ref={(el) => (tabsRef.current[1] = el)}
                        onClick={() => handleTabClick(1, 'heatmap')}
                    >
                        HEATMAP
                    </button>
                </div>
                <span
                    className="absolute bottom-0 h-1.5 bg-wOrange transition-all duration-300"
                    style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                />
            </div>
            <svg className='w-2/3' id="heatmap"></svg>
        </div>
    );
}

export default PlayerShots;