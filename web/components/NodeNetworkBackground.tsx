'use client';

import { useEffect, useRef } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    region: string;
    active: boolean;
}

interface Connection {
    from: number;
    to: number;
    strength: number;
}

export default function NodeNetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create nodes (reduced from 50 to 30 for less distraction)
        const nodes: Node[] = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, // Slower movement
            vy: (Math.random() - 0.5) * 0.3,
            region: ['US', 'EU', 'ASIA'][Math.floor(Math.random() * 3)],
            active: Math.random() > 0.8 // Fewer active nodes
        }));

        // Create connections
        const connections: Connection[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    connections.push({
                        from: i,
                        to: j,
                        strength: 1 - distance / 150
                    });
                }
            }
        }

        let animationId: number;
        let time = 0;

        const animate = () => {
            time += 0.01;

            // Clear canvas
            ctx.fillStyle = 'rgba(12, 13, 16, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update node positions
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            });

            // Draw connections (more subtle)
            connections.forEach(conn => {
                const from = nodes[conn.from];
                const to = nodes[conn.to];

                const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
                gradient.addColorStop(0, `rgba(58, 242, 255, ${conn.strength * 0.08})`); // Reduced opacity
                gradient.addColorStop(0.5, `rgba(125, 249, 255, ${conn.strength * 0.15})`);
                gradient.addColorStop(1, `rgba(58, 242, 255, ${conn.strength * 0.08})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = conn.strength * 1;
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();

                // Payment flow animation
                if (from.active && to.active && Math.random() > 0.98) {
                    const t = (time % 1);
                    const px = from.x + (to.x - from.x) * t;
                    const py = from.y + (to.y - from.y) * t;

                    ctx.fillStyle = '#3AF2FF';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#3AF2FF';
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            // Draw nodes
            nodes.forEach((node, i) => {
                const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;

                if (node.active) {
                    // Active node glow
                    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 15);
                    gradient.addColorStop(0, 'rgba(58, 242, 255, 0.4)');
                    gradient.addColorStop(1, 'rgba(58, 242, 255, 0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 15 * pulse, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Node circle
                ctx.fillStyle = node.active ? '#3AF2FF' : '#42E7D6';
                ctx.shadowBlur = node.active ? 10 : 0;
                ctx.shadowColor = '#3AF2FF';
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.active ? 4 : 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 -z-10 bg-[#0C0D10]"
            />
            {/* Dark gradient overlay for content focus */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0C0D10]/60 via-[#0C0D10]/40 to-[#0C0D10]/60 pointer-events-none" />
        </>
    );
}
