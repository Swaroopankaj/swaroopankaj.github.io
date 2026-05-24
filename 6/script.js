/* ==========================================================================
   PORTFOLIO INTERACTIVE ACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- State Variables ---
    let activeTheme = localStorage.getItem('pankaj-accent-theme') || 'theme-indigo';
    let isSimulatorRunning = false;
    let terminalInterval = null;

    // --- DOM Elements ---
    const body = document.body;
    const jsCursorGlow = document.getElementById('js-cursor-glow');
    const navbar = document.getElementById('navbar');
    const customizerToggle = document.getElementById('customizer-toggle');
    const customizerMenu = document.getElementById('customizer-menu');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // --- 1. Initialize Active Accent Theme ---
    body.className = activeTheme;
    colorSwatches.forEach(swatch => {
        if (swatch.dataset.theme === activeTheme) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }
    });

    // Toggle Accent Customizer dropdown menu
    if (customizerToggle && customizerMenu) {
        customizerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = customizerToggle.getAttribute('aria-expanded') === 'true';
            customizerToggle.setAttribute('aria-expanded', !expanded);
            customizerMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            customizerToggle.setAttribute('aria-expanded', 'false');
            customizerMenu.classList.remove('active');
        });
    }

    // Color Swatch Selection Handler
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            const newTheme = swatch.dataset.theme;
            body.className = newTheme;
            localStorage.setItem('pankaj-accent-theme', newTheme);
            
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            // Re-render simulator wires since colors might change slightly
            drawWires();
        });
    });

    // --- 2. Custom Magnetic Cursor Glow Movement ---
    if (jsCursorGlow) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            jsCursorGlow.style.left = x + 'px';
            jsCursorGlow.style.top = y + 'px';
        });

        // Hover scale effects on interactive elements
        const hoverInteractives = document.querySelectorAll('a, button, .playbook-item, .project-card, .service-card, .blog-card');
        hoverInteractives.forEach(item => {
            item.addEventListener('mouseenter', () => {
                jsCursorGlow.style.transform = 'translate(-50%, -50%) scale(1.3)';
            });
            item.addEventListener('mouseleave', () => {
                jsCursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // --- 3. Navbar Scroll effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Mobile Navigation Drawer Toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // --- 4. Simulated Agentic Workflow SVG Wire Drawing ---
    function drawWires() {
        const svg = document.getElementById('sim-wires');
        if (!svg) return;
        svg.innerHTML = ''; // clear

        const nodes = {
            user: document.getElementById('node-user'),
            orchestrator: document.getElementById('node-orchestrator'),
            tools: document.getElementById('node-tools'),
            guard: document.getElementById('node-guard'),
            output: document.getElementById('node-output')
        };

        if (!nodes.user || !nodes.orchestrator || !nodes.tools || !nodes.guard || !nodes.output) return;

        const canvasRect = document.getElementById('simulator-canvas').getBoundingClientRect();

        function getCenterCoords(el) {
            const rect = el.getBoundingClientRect();
            return {
                x: (rect.left + rect.width / 2) - canvasRect.left,
                y: (rect.top + rect.height / 2) - canvasRect.top
            };
        }

        const coords = {
            user: getCenterCoords(nodes.user),
            orchestrator: getCenterCoords(nodes.orchestrator),
            tools: getCenterCoords(nodes.tools),
            guard: getCenterCoords(nodes.guard),
            output: getCenterCoords(nodes.output)
        };

        // Create Path String
        function createCurve(c1, c2) {
            const dx = c2.x - c1.x;
            const dy = c2.y - c1.y;
            const cp1x = c1.x + dx * 0.4;
            const cp1y = c1.y;
            const cp2x = c1.x + dx * 0.6;
            const cp2y = c2.y;
            return `M ${c1.x} ${c1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${c2.x} ${c2.y}`;
        }

        const connections = [
            { from: coords.user, to: coords.orchestrator, id: 'wire-user-orch' },
            { from: coords.orchestrator, to: coords.tools, id: 'wire-orch-tools' },
            { from: coords.tools, to: coords.guard, id: 'wire-tools-guard' },
            { from: coords.guard, to: coords.output, id: 'wire-guard-output' },
            { from: coords.output, to: coords.orchestrator, id: 'wire-output-orch' }
        ];

        connections.forEach(conn => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', createCurve(conn.from, conn.to));
            path.setAttribute('class', 'sim-wire-path');
            path.setAttribute('id', conn.id);
            svg.appendChild(path);
        });
    }

    // Call drawWires on initialization and window resizing
    setTimeout(drawWires, 100);
    window.addEventListener('resize', drawWires);

    // --- 5. Interactive Agentic Simulator Execution Flow ---
    const btnTriggerSimulator = document.getElementById('btn-trigger-simulator');
    const simStatusText = document.querySelector('.simulator-status');
    
    if (btnTriggerSimulator) {
        btnTriggerSimulator.addEventListener('click', () => {
            if (isSimulatorRunning) return;
            isSimulatorRunning = true;
            btnTriggerSimulator.disabled = true;
            btnTriggerSimulator.style.opacity = '0.6';
            simStatusText.textContent = 'EXECUTING...';
            simStatusText.style.color = 'var(--secondary)';

            const nodes = {
                user: document.getElementById('node-user'),
                orchestrator: document.getElementById('node-orchestrator'),
                tools: document.getElementById('node-tools'),
                guard: document.getElementById('node-guard'),
                output: document.getElementById('node-output')
            };

            const subTools = {
                search: document.getElementById('tool-search'),
                matlab: document.getElementById('tool-matlab'),
                eval: document.getElementById('tool-eval')
            };

            // Reset classes
            Object.values(nodes).forEach(n => n.classList.remove('active'));
            Object.values(subTools).forEach(st => st.classList.remove('active'));
            document.querySelectorAll('.sim-wire-path').forEach(w => w.classList.remove('active'));

            // Step 1: User query active
            setTimeout(() => {
                nodes.user.classList.add('active');
                document.getElementById('wire-user-orch').classList.add('active');
                nodes.user.querySelector('.node-val').textContent = '"Analyze R&D sensor run"';
            }, 200);

            // Step 2: Orchestrator thinking
            setTimeout(() => {
                nodes.orchestrator.classList.add('active');
                document.getElementById('wire-orch-tools').classList.add('active');
                nodes.orchestrator.querySelector('.node-val').textContent = 'Analyzing parameters...';
            }, 1200);

            // Step 3: Tool Execution (co-execution sequential activation)
            setTimeout(() => {
                nodes.tools.classList.add('active');
                nodes.orchestrator.querySelector('.node-val').textContent = 'Routing: sensor_db & matlab_core';
            }, 2200);

            // 3a. Flash sub-tool DB
            setTimeout(() => { subTools.search.classList.add('active'); }, 2600);
            // 3b. Flash sub-tool MATLAB simulation engine
            setTimeout(() => { subTools.matlab.classList.add('active'); }, 3300);
            // 3c. Flash sub-tool Python runtime evaluator
            setTimeout(() => { subTools.eval.classList.add('active'); }, 4000);

            // Step 4: Guardrails Evaluation
            setTimeout(() => {
                document.getElementById('wire-tools-guard').classList.add('active');
                nodes.guard.classList.add('active');
                nodes.guard.querySelector('.node-val').textContent = 'Check: Hallucination score < 0.05';
            }, 4800);

            // Step 5: Final output response typewriter stream
            setTimeout(() => {
                document.getElementById('wire-guard-output').classList.add('active');
                nodes.output.classList.add('active');
                nodes.output.querySelector('.node-val').textContent = 'Valid Schema. Transmitting...';
            }, 6000);

            // Step 6: Complete Cycle Response
            setTimeout(() => {
                document.getElementById('wire-output-orch').classList.add('active');
                nodes.output.querySelector('.node-val').textContent = 'Success: Cycles reduced 70%';
                
                // Return System ready
                isSimulatorRunning = false;
                btnTriggerSimulator.disabled = false;
                btnTriggerSimulator.style.opacity = '1';
                simStatusText.textContent = 'FLOW COMPLETED';
                simStatusText.style.color = 'var(--accent)';
                
                setTimeout(() => {
                    if (!isSimulatorRunning) {
                        simStatusText.textContent = 'SYSTEM READY';
                        simStatusText.style.color = 'var(--text-secondary)';
                    }
                }, 4000);
            }, 7200);
        });
    }

    // --- 6. Live Agent Playbook Terminal Logs Sandbox ---
    const playbooksData = {
        mailbot: [
            { type: 'prompt', text: 'python openclaw_mailbot.py --run' },
            { type: 'time', text: '20:31:02' },
            { type: 'agent', agent: 'Orchestrator', text: 'Initializing multi-account scan on Pankaj\'s developer inbox...' },
            { type: 'tool', tool: 'SearchTool', text: 'Found 3 unread business inquiries. Routing to RAG pipelines.' },
            { type: 'thought', text: 'Thinking: Identifying semantic intent. First inquiry concerns R&D validation; second, OpenCV editor; third is recruiter spam.' },
            { type: 'agent', agent: 'MailAgent', text: 'Parsing query 1: "Automating validation tests". Conducting semantic search across folder 4 results...' },
            { type: 'tool', tool: 'VectorDB', text: 'Semantic lookup matched: "Sensor validation automation cut cycles 70% using MATLAB/Python".' },
            { type: 'thought', text: 'Thinking: Constructing a polite, professional, and data-driven response detailing Pankaj\'s expertise.' },
            { type: 'agent', agent: 'CriticAgent', text: 'Evaluating drafted response... Safety checks passed. No prompt leaks. Professional tone score: 98%.' },
            { type: 'success', text: 'Success: Replied drafted contextual response. Archived inquiry. Automation completed.' }
        ],
        careerops: [
            { type: 'prompt', text: 'python careerops_pipeline.py --profile biotech_lead' },
            { type: 'time', text: '20:31:05' },
            { type: 'agent', agent: 'JobFinder', text: 'Crawling active Biotech and Computational Chemistry vacancies in Stockholm...' },
            { type: 'tool', tool: 'WebScraper', text: 'Extracted 12 vacancies matching criteria. Running semantic matching with Pankaj\'s profile.' },
            { type: 'thought', text: 'Thinking: Cross-matching requirements. Found Swedish Biotech Lab looking for "Python, MATLAB, and deep classification networks". Perfect fit score: 95%.' },
            { type: 'agent', agent: 'CVTailor', text: 'Tailoring Pankaj\'s CV for Swedish Biotech vacancy. Highlighting MATLAB sensor pipelines and Deep Learning X-ray models...' },
            { type: 'tool', tool: 'ATS_Evaluator', text: 'ATS Alignment Score: 96% compatibility. Customizing cover letter text.' },
            { type: 'agent', agent: 'Orchestrator', text: 'Confirming alignment... Running final submission module.' },
            { type: 'success', text: 'Success: Application submitted autonomously to Stockholm Biotech Lab. Notifying user via Discord.' }
        ],
        xray: [
            { type: 'prompt', text: 'python xray_classifier.py --predict --image ./assets/scans/test_lung_042.png' },
            { type: 'time', text: '20:31:09' },
            { type: 'agent', agent: 'VisionCore', text: 'Loading TensorFlow Keras network... Running diagnostic pipelines.' },
            { type: 'tool', tool: 'OpenCV', text: 'Preprocessing image: Grayscale transform, resized to 224x224, applied CLAHE enhancement.' },
            { type: 'thought', text: 'Thinking: Running forward inference pass. Latency: 12ms. Convolution layers map features onto high-density activations.' },
            { type: 'tool', tool: 'GPU_Accelerator', text: 'Forward pass complete. Extracting activation maps.' },
            { type: 'agent', agent: 'Evaluator', text: 'Softmax predictions loaded. Node active probabilities calculated.' },
            { type: 'success', text: 'Diagnosis Label: PNEUMONIA CLEAR (Confidence: 98.4%). Report generated.' }
        ],
        matlab: [
            { type: 'prompt', text: 'matlab -batch "run_sensor_validation_automation"' },
            { type: 'time', text: '20:31:12' },
            { type: 'agent', agent: 'MATLAB_Engine', text: 'Initializing R&D telemetry workspace variables...' },
            { type: 'tool', tool: 'SensorDB', text: 'Ingested 2.4GB of raw CSV automotive sensor telemetry runs.' },
            { type: 'thought', text: 'Thinking: Cleansing signals, removing null vectors, computing fast-Fourier transformations (FFT).' },
            { type: 'tool', tool: 'PandasExporter', text: 'Signals parsed. Exporting refined metrics to NumPy tensors.' },
            { type: 'agent', agent: 'ValEngine', text: 'Plotting signal spectrums... Validation test checks pass.' },
            { type: 'success', text: 'Automated Pipeline Success: Reduced validation cycle time by 70%. Saved log to ./runs/run_24.log' }
        ]
    };

    const terminalScreen = document.getElementById('terminal-screen');
    const playbookItems = document.querySelectorAll('.playbook-item');
    const btnRestartTerminal = document.getElementById('btn-restart-terminal');
    let currentPlaybookKey = 'mailbot';

    function runPlaybook(key) {
        if (terminalInterval) clearInterval(terminalInterval);
        
        terminalScreen.innerHTML = '';
        const logs = playbooksData[key];
        let index = 0;

        function printLogLine() {
            if (index >= logs.length) {
                clearInterval(terminalInterval);
                return;
            }

            const log = logs[index];
            const line = document.createElement('div');
            line.className = 'terminal-line';

            if (log.type === 'prompt') {
                line.innerHTML = `<span class="t-prompt">agent_orchestrator@pankaj:~$</span> ${log.text}`;
            } else if (log.type === 'time') {
                line.innerHTML = `<span class="log-time">[${log.text}]</span> Initializing process...`;
            } else if (log.type === 'agent') {
                line.innerHTML = `<span class="log-time">[AGENT]</span> <span class="log-agent">${log.agent}</span>: ${log.text}`;
            } else if (log.type === 'tool') {
                line.innerHTML = `<span class="log-time">[TOOL]</span> <span class="log-tool">${log.tool}</span>: invoked ${log.text}`;
            } else if (log.type === 'thought') {
                line.innerHTML = `<span class="log-time">[THOUGHT]</span> <span class="log-thought">${log.text}</span>`;
            } else if (log.type === 'success') {
                line.innerHTML = `<span class="log-time">[RESULT]</span> <span class="log-success">${log.text}</span>`;
            } else if (log.type === 'error') {
                line.innerHTML = `<span class="log-time">[ERROR]</span> <span class="log-error">${log.text}</span>`;
            }

            terminalScreen.appendChild(line);
            terminalScreen.scrollTop = terminalScreen.scrollHeight; // Auto scroll
            index++;
        }

        // Print first line immediately, then stream
        printLogLine();
        terminalInterval = setInterval(printLogLine, 750);
    }

    // Playbook selector click events
    playbookItems.forEach(item => {
        item.addEventListener('click', () => {
            playbookItems.forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            
            currentPlaybookKey = item.dataset.playbook;
            runPlaybook(currentPlaybookKey);
        });
    });

    if (btnRestartTerminal) {
        btnRestartTerminal.addEventListener('click', () => {
            runPlaybook(currentPlaybookKey);
        });
    }

    // Start default stream after slightly delay
    setTimeout(() => {
        runPlaybook('mailbot');
    }, 1500);

    // --- 7. Portfolio Dynamic Gallery Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state tabs
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filterValue = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });

    // --- 8. Case Study Database & Modal Detail Injections ---
    const caseStudiesData = {
        mailbot: {
            title: "OpenClaw MailBot: Autonomous Multi-Account Assistant",
            metric: "⚡ Autonomous Multi-Agent",
            challenge: "Managing business communications across fragmented pipelines created extensive lag, missed inquiries, and wasted hours drafting repetitive responses.",
            solution: "Designed a multi-agent orchestration architecture utilizing LangGraph state mechanics. MailBot autonomously scans mail accounts via secure APIs, runs a vector Retrieval-Augmented Generation (RAG) context search to fetch Pankaj's matching historical case logs, tailored cover designs or services, and drafts human-like contextual responses. It integrates with a safety-critic LLM evaluator that guarantees no system prompt leakage and matches brand tone thresholds.",
            roiResult: "95% Automation of General Inquiries",
            roiDesc: "Replaces manual message categorization, summarizing, context lookup, and draft creation. The system operates on a cron schedule with zero user intervention.",
            tech: ["LangGraph", "Python Core", "OpenRouter API", "Vector RAG DB", "LLM Guardrails"],
            demo: "https://github.com/Swaroopankaj",
            github: "https://github.com/Swaroopankaj"
        },
        careerops: {
            title: "CareerOps Agent: Autonomous Biotech Pipeline",
            metric: "🎯 ATS-Optimized Automation",
            challenge: "Biotech applicants suffer from lengthy job scanning workflows, generic resume rejections, and manual parsing inefficiencies that delay high-value submissions.",
            solution: "Architected a custom selenium-driven web crawler agent that monitors targeted Swedish biotech directories. Upon finding matching postings, a multi-agent chaintailors Pankaj's CV specifically for the position, highlighting relevant signal processing, computer vision, or MATLAB skills, runs an internal ATS-scoring module for formatting keyword compliance, and completes the form submissions.",
            roiResult: "Full-Cycle Autonomous Scans & Tailoring",
            roiDesc: "Reduced operational research and application times from hours per day to zero. Tailors resumes with high contextual accuracy.",
            tech: ["Selenium", "LLM Agent Chains", "ATS Alignment Parser", "Python Scripting"],
            demo: "https://github.com/Swaroopankaj",
            github: "https://github.com/Swaroopankaj"
        },
        vitalsync: {
            title: "VitalSync AI: Recurrent Wearable Analytics",
            metric: "🧠 LSTM Bio-Signals",
            challenge: "High-performance physical training diagnostics require analyzing unstructured wearable time-series biometric variables (heart-rate, body temp, sleep cycles) to predict recovery bounds.",
            solution: "Built a predictive pipeline in Python importing wearable data, cleaning signal anomalies using Kalman filters, and feeding preprocessed arrays to a Recurrent Neural Network (LSTM). The model maps sequential correlations to output recovery indexes, helping athletes preempt training burnout.",
            roiResult: "High Precision Recurrent Forecasting",
            roiDesc: "Trained on real wearable metrics, providing valuable quantitative forecasting outputs for recovery planning.",
            tech: ["LSTM Networks", "Keras / TensorFlow", "Kalman Signal Processing", "NumPy & Pandas"],
            demo: "https://github.com/Swaroopankaj",
            github: "https://github.com/Swaroopankaj"
        },
        neuralcanvas: {
            title: "NeuralCanvas Studio: Stable Diffusion Engine",
            metric: "🎨 Generative Content Studio",
            challenge: "Creative asset development for Celestial and Victorian Noir visual guidelines took designers weeks to hand-craft, slowing iterative storytelling.",
            solution: "Created a generative suite utilizing customized Stable Diffusion weights. Built automated image processing and contrast-scaling pipelines, helping creators query semantic prompts and instantly render production-ready noir visual blocks.",
            roiResult: "Iterative Rapid Rendering Cycles",
            roiDesc: "Accelerated creative conceptualization and asset production cycles from weeks to minutes, directly in the workspace environment.",
            tech: ["Stable Diffusion", "Generative Prompt Ensembles", "OpenCV Image Pipelines", "Python"],
            demo: "https://github.com/Swaroopankaj",
            github: "https://github.com/Swaroopankaj"
        },
        xray: {
            title: "Automated X-Ray Diagnostics DL Classifier",
            metric: "👁️ 95%+ Diagnostic Accuracy",
            challenge: "R&D classification bottlenecks in diagnostic environments delay raw image processing and require manual review of thousands of normal scans.",
            solution: "Developed an end-to-end deep learning classifier using TensorFlow. Ingests raw X-ray chest scans, conducts high-pass filtering and contrast enhancement via OpenCV, processes image structures using custom Convolutional Neural Network (CNN) feature maps, and outputs diagnosis probabilities.",
            roiResult: "95%+ Validation Model Precision",
            roiDesc: "Delivered automated diagnostic insights with 95%+ accuracy, significantly shortening raw scan screening pipelines.",
            tech: ["TensorFlow CNN", "Keras Deep Nets", "OpenCV Preprocessing", "Seaborn Metrics Plotting"],
            demo: "https://swaroopankaj.github.io/XrayAnalysisModel/",
            github: "https://github.com/Swaroopankaj"
        },
        detection: {
            title: "Real-Time Object Detection Browser System",
            metric: "⚡ Zero Server Setup",
            challenge: "Deploying high-performance machine learning object detection systems usually requires expensive cloud servers and GPU infrastructures, creating latency and setup friction.",
            solution: "Built a browser-based client-side object detection application. Leveraged TensorFlow.js to load pre-trained COCO-SSD weights directly in the client's browser. Processed camera viewports and local image uploads locally, tracking coordinates and displaying bounds in real-time.",
            roiResult: "100% Edge Inference Execution",
            roiDesc: "Completely eliminated server operational costs, latency bottlenecks, and user privacy risks by keeping data completely in-browser.",
            tech: ["TensorFlow.js Model", "Vanilla ES6 JavaScript", "Tailwind CSS Layouts", "HTML5 Viewport Canvas"],
            demo: "https://swaroopankaj.github.io/real-time-object-detection/",
            github: "https://github.com/Swaroopankaj"
        },
        nebula: {
            title: "Nebula Image Editor: OpenCV Client Pipeline",
            metric: "⚙️ WASM Image Processing",
            challenge: "Corporate design teams suffered from complex editor installation barriers and slow remote cloud processing latency when applying heavy filters.",
            solution: "Engineered Nebula, a browser-native high-performance editing workspace. Integrated OpenCV compiled to WebAssembly (Wasm) and Google MediaPipe framework, letting designers run edge detection, grayscale transforms, chroma keying, and visual filters instantly at 60fps.",
            roiResult: "60 FPS Native Web Assembly Performance",
            roiDesc: "Provided a zero-install, professional editor that runs entirely on local GPU/CPU threads in-browser.",
            tech: ["OpenCV WebAssembly", "MediaPipe API", "CSS Core Filters", "Vanilla JavaScript"],
            demo: "https://swaroopankaj.github.io/Nebula-ImageEditor/",
            github: "https://github.com/Swaroopankaj"
        },
        sensor: {
            title: "R&D Sensor Automated Data Pipelines",
            metric: "⏱️ 70% Cut in Validation Cycles",
            challenge: "Automotive testing engineers spent weeks manually cleaning, cataloging, and plotting raw multi-gigabyte telemetry datasets from sensor test runs.",
            solution: "Designed automated data automation pipelines combining MATLAB engines with Python pandas routines. Built clean, deterministic parsers that identify operational anomalies, compute fast-Fourier transforms (FFT) for signal frequency analysis, and auto-generate PDF diagnostic dashboards.",
            roiResult: "Cut Validation Cycles from Days to Hours",
            roiDesc: "Reduced R&D processing time by 70%, allowing mechanical teams to act on telemetry conclusions almost instantly.",
            tech: ["MATLAB Computational Engine", "Python Signal Core", "Pandas & NumPy", "Automated PDF Exporters"],
            demo: "https://github.com/Swaroopankaj",
            github: "https://github.com/Swaroopankaj"
        },
        inspection: {
            title: "AI-Powered Quality Inspection Pipeline",
            metric: "🛠️ Automated Quality Control",
            challenge: "Manual visual inspection of thousands of signal samples and component shapes resulted in human fatigue, inconsistent validation labels, and 3-day backlog queues.",
            solution: "Constructed a modular pipeline that automatically ingests component imagery, runs spatial segmentation using OpenCV, and executes deep-learning classification. Integrated MATLAB Simulink interfaces with GPU acceleration to handle fast throughput.",
            roiResult: "Replaced 3-Day Manual Queues",
            roiDesc: "Automated sample inspection, achieving 95%+ precision and enabling real-time classification at the testing line.",
            tech: ["MATLAB Simulink", "TensorFlow GPU Core", "OpenCV Segmentation", "GPU Threads Acceleration"],
            demo: "https://github.com/Swaroopankaj",
            github: "https://github.com/Swaroopankaj"
        }
    };

    const caseStudyModal = document.getElementById('case-study-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    window.openCaseStudy = function(id) {
        const data = caseStudiesData[id];
        if (!data) return;

        // Inject content
        document.getElementById('modal-metric').textContent = data.metric;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-challenge').textContent = data.challenge;
        document.getElementById('modal-solution').textContent = data.solution;
        document.getElementById('modal-roi-result').textContent = data.roiResult;
        document.getElementById('modal-roi-desc').textContent = data.roiDesc;

        // Inject Tech Tags
        const techList = document.getElementById('modal-tech-list');
        techList.innerHTML = '';
        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t;
            techList.appendChild(span);
        });

        // Inject links
        const linksWrap = document.getElementById('modal-links-wrap');
        linksWrap.innerHTML = '';
        
        const demoLink = document.createElement('a');
        demoLink.href = data.demo;
        demoLink.target = "_blank";
        demoLink.rel = "noopener";
        demoLink.className = "btn-sidebar-link btn-sidebar-link-primary";
        demoLink.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Try Live Demo`;
        linksWrap.appendChild(demoLink);

        const githubLink = document.createElement('a');
        githubLink.href = data.github;
        githubLink.target = "_blank";
        githubLink.rel = "noopener";
        githubLink.className = "btn-sidebar-link";
        githubLink.innerHTML = `<i class="fa-brands fa-github"></i> Repository Code`;
        linksWrap.appendChild(githubLink);

        // Open Modal
        caseStudyModal.classList.add('active');
        caseStudyModal.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden'; // Lock background scroll
    };

    function closeCaseStudy() {
        caseStudyModal.classList.remove('active');
        caseStudyModal.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Unlock scroll
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeCaseStudy);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && caseStudyModal.classList.contains('active')) {
            closeCaseStudy();
        }
    });

    // --- 9. Blog Post Like Counter Client Storage Interaction ---
    const btnLikes = document.querySelectorAll('.btn-like');

    btnLikes.forEach(btn => {
        const blogId = btn.dataset.blogId;
        const counterEl = btn.querySelector('.like-counter');
        
        // Load initial liked states
        const isLiked = localStorage.getItem(`blog-liked-${blogId}`) === 'true';
        if (isLiked) {
            btn.classList.add('liked');
            btn.querySelector('i').className = 'fa-solid fa-heart';
        }

        btn.addEventListener('click', () => {
            const currentlyLiked = btn.classList.contains('liked');
            let currentVal = parseInt(counterEl.textContent, 10);

            if (currentlyLiked) {
                // Unlike
                btn.classList.remove('liked');
                btn.querySelector('i').className = 'fa-regular fa-heart';
                counterEl.textContent = currentVal - 1;
                localStorage.setItem(`blog-liked-${blogId}`, 'false');
            } else {
                // Like
                btn.classList.add('liked');
                btn.querySelector('i').className = 'fa-solid fa-heart';
                counterEl.textContent = currentVal + 1;
                localStorage.setItem(`blog-liked-${blogId}`, 'true');
                
                // Trigger quick subtle pop animation
                btn.style.transform = 'scale(1.2)';
                setTimeout(() => btn.style.transform = '', 200);
            }
        });
    });

    // --- 10. Floating Label Contact Form Success Handling ---
    const contactForm = document.getElementById('contact-form');
    const btnSubmitContact = document.getElementById('btn-submit-contact');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSpan = btnSubmitContact.querySelector('span');
            const btnIcon = btnSubmitContact.querySelector('i');
            const originalText = btnSpan.textContent;
            
            btnSpan.textContent = 'TRANSMITTING INQUIRY...';
            btnIcon.className = 'fa-solid fa-sync fa-spin';
            btnSubmitContact.disabled = true;

            // Simulated post submission timeline
            setTimeout(() => {
                btnSpan.textContent = 'ARCHITECT BRIEF REQUESTED!';
                btnIcon.className = 'fa-solid fa-circle-check';
                btnSubmitContact.style.background = 'var(--accent)';
                btnSubmitContact.style.borderColor = 'transparent';
                
                contactForm.reset();
                
                // Return back to ready state after delay
                setTimeout(() => {
                    btnSpan.textContent = originalText;
                    btnIcon.className = 'fa-solid fa-paper-plane';
                    btnSubmitContact.style.background = '';
                    btnSubmitContact.disabled = false;
                }, 4000);
            }, 1800);
        });
    }

    // --- 11. Intersection Observer Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 12. Soft Scroll for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefVal = this.getAttribute('href');
            if (hrefVal === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(hrefVal);
            if (target) {
                // If mobile drawer was active, toggle it off
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }

                window.scrollTo({
                    top: target.offsetTop - 85,
                    behavior: 'smooth'
                });
            }
        });
    });
});
