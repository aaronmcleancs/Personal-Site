from manim import *

class QuantumComputingAnimation(Scene):
    def construct(self):
        # Create a title
        title = Text("Quantum Computing Capstone", font_size=40)
        title.to_edge(UP)
        
        # Create the skills text
        skills = Text("Skills: Qiskit, Quantum Mechanics, Blockchain, Distributed Systems", 
                     font_size=24, color=BLUE)
        skills.next_to(title, DOWN, buff=0.5)
        
        # Quantum circuit representation
        circuit_bg = Rectangle(height=2, width=5, fill_opacity=0.2, fill_color=BLUE)
        circuit_bg.shift(UP * 0.5)
        
        # Quantum bits (qubits)
        qubits = VGroup()
        for i in range(3):
            qubit_line = Line(LEFT * 2.4, RIGHT * 2.4, color=WHITE)
            qubit_line.shift(UP * (1.0 - i * 0.6))
            
            qubit_label = MathTex(f"|q_{i}\\rangle")
            qubit_label.scale(0.7)
            qubit_label.next_to(qubit_line, LEFT, buff=0.2)
            
            qubits.add(VGroup(qubit_line, qubit_label))
        
        # Quantum gates
        gates = VGroup()
        
        # H gates (Hadamard)
        for i in range(3):
            h_gate = Square(side_length=0.5, color=YELLOW, fill_opacity=0.8, fill_color=YELLOW)
            h_gate.move_to(qubits[i][0].get_center() + RIGHT * 1)
            h_text = Text("H", font_size=20)
            h_text.move_to(h_gate)
            gates.add(VGroup(h_gate, h_text))
        
        # CNOT gate
        cnot_control = Dot(radius=0.1, color=WHITE)
        cnot_control.move_to(qubits[0][0].get_center() + RIGHT * 2)
        
        cnot_target = Circle(radius=0.15, color=WHITE)
        cnot_target.move_to(qubits[1][0].get_center() + RIGHT * 2)
        
        cnot_line = Line(cnot_control.get_center(), cnot_target.get_center())
        
        gates.add(VGroup(cnot_control, cnot_target, cnot_line))
        
        # Blockchain representation
        blockchain = VGroup()
        num_blocks = 5
        
        for i in range(num_blocks):
            block = Rectangle(height=1, width=1.2, fill_opacity=0.8, 
                             fill_color=interpolate_color(GREEN_E, BLUE_E, i/num_blocks))
            
            if i > 0:
                block.next_to(blockchain[-1], RIGHT, buff=0.3)
                
                # Connection arrow
                arrow = Arrow(blockchain[-1].get_right(), block.get_left(), color=WHITE)
                blockchain.add(arrow)
                
            blockchain.add(block)
        
        blockchain.shift(DOWN * 1.5)
        
        # Complexity comparison
        complexity_text = VGroup(
            Text("Classical: O(n·m)", font_size=24, color=RED),
            Text("Quantum: O(log n)", font_size=24, color=GREEN)
        )
        complexity_text.arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        complexity_text.shift(DOWN * 1.5 + RIGHT * 3)
        
        # Animation sequence
        self.play(Write(title))
        self.play(Write(skills))
        self.wait(0.5)
        
        # Quantum circuit
        self.play(Create(circuit_bg))
        
        for qubit in qubits:
            self.play(Create(qubit))
        
        # Add gates with bloch sphere visualization
        for gate in gates[:3]:  # Hadamard gates
            self.play(FadeIn(gate))
            
            # Add small bloch sphere to visualize state
            i = gates[:3].index(gate)
            sphere = Circle(radius=0.3, color=WHITE)
            sphere.move_to(gate.get_center() + UP * 0.8)
            
            # State vector
            vector = Line(sphere.get_center(), sphere.get_center() + RIGHT * 0.3, color=RED)
            
            self.play(Create(sphere), Create(vector))
            
            # Show superposition after Hadamard
            self.play(Rotate(vector, angle=PI/2))
            
            self.wait(0.2)
            self.play(FadeOut(sphere), FadeOut(vector))
        
        # CNOT gate
        self.play(FadeIn(gates[3]))
        
        # Blockchain animation
        for block in blockchain:
            self.play(FadeIn(block))
        
        # Complexity comparison
        self.play(Write(complexity_text))
        
        # Looping animation to show quantum state evolution
        for _ in range(3):
            # Quantum state evolution
            # Simulate quantum state evolution with rotating vectors
            state_vectors = []
            spheres = []
            
            for i in range(3):
                sphere = Circle(radius=0.3, color=WHITE)
                sphere.move_to(qubits[i][0].get_center() + RIGHT * 3)
                
                vector = Line(sphere.get_center(), 
                             sphere.get_center() + RIGHT * 0.3, 
                             color=RED)
                
                spheres.append(sphere)
                state_vectors.append(vector)
            
            self.play(*[Create(s) for s in spheres], *[Create(v) for v in state_vectors])
            
            # Rotate the state vectors to simulate quantum evolution
            self.play(*[Rotate(v, angle=PI/2) for v in state_vectors])
            self.play(*[Rotate(v, angle=PI/2) for v in state_vectors])
            
            # Quantum to classical: measure the qubits
            measurements = []
            for i in range(3):
                measured_value = Text("|1⟩" if i % 2 == 0 else "|0⟩", font_size=20)
                measured_value.next_to(qubits[i][0], RIGHT, buff=4)
                measurements.append(measured_value)
            
            self.play(
                *[FadeOut(s) for s in spheres],
                *[FadeOut(v) for v in state_vectors],
                *[Write(m) for m in measurements]
            )
            
            # Show data being added to blockchain
            new_data = Star(n=5, outer_radius=0.3, color=YELLOW)
            new_data.next_to(blockchain[-1], UP)
            
            self.play(FadeIn(new_data))
            self.play(new_data.animate.move_to(blockchain[-1].get_center()))
            
            # Pulse effect for blockchain verification
            self.play(
                *[block.animate.scale(1.1) for block in blockchain if isinstance(block, Rectangle)],
                run_time=0.5
            )
            self.play(
                *[block.animate.scale(1/1.1) for block in blockchain if isinstance(block, Rectangle)],
                run_time=0.5
            )
            
            # Cleanup for next iteration
            self.play(*[FadeOut(m) for m in measurements], FadeOut(new_data))
            
        self.wait(1)