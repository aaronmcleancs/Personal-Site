from manim import *
import random

class SystemsArchitectureAnimation(Scene):
    def construct(self):
        # Create a title
        title = Text("Systems Architecture", font_size=40)
        title.to_edge(UP)
        
        # Create the skills text
        skills = Text("Skills: C++, Multithreading, Real-time Simulation, Linear Algebra", 
                     font_size=24, color=BLUE)
        skills.next_to(title, DOWN, buff=0.5)
        
        # Create simulation environment
        simulation_box = Square(side_length=6, color=WHITE)
        simulation_box.shift(DOWN * 0.5)
        
        # Create particle system
        num_particles = 50
        particles = VGroup(*[Dot(radius=0.05, color=random_color()) for _ in range(num_particles)])
        
        # Position particles randomly within the box
        for particle in particles:
            random_pos = np.array([
                random.uniform(-2.5, 2.5),
                random.uniform(-2.5, 2.5),
                0
            ])
            particle.move_to(simulation_box.get_center() + random_pos)
        
        # Visualization of multiple threads
        threads = VGroup()
        num_threads = 4
        thread_width = 1.5
        
        for i in range(num_threads):
            thread = Rectangle(height=0.5, width=thread_width, fill_opacity=0.8,
                              fill_color=interpolate_color(BLUE, RED, i/num_threads))
            thread.shift(RIGHT * 4 + UP * (1.5 - i*0.6))
            
            thread_label = Text(f"Thread {i+1}", font_size=16)
            thread_label.next_to(thread, LEFT, buff=0.2)
            
            threads.add(VGroup(thread, thread_label))
        
        # Animation sequence
        self.play(Write(title))
        self.play(Write(skills))
        self.wait(0.5)
        
        # Simulation box
        self.play(Create(simulation_box))
        
        # Add particles
        self.play(FadeIn(particles, lag_ratio=0.05))
        
        # Add threads
        self.play(FadeIn(threads))
        
        # Looping animation of particle movement and forces
        velocities = [np.array([
            random.uniform(-0.1, 0.1),
            random.uniform(-0.1, 0.1),
            0
        ]) for _ in range(num_particles)]
        
        # Function to update particle positions
        def update_particles():
            animations = []
            
            # Update each particle position based on velocity
            for i, particle in enumerate(particles):
                # Simple boundary reflection
                pos = particle.get_center()
                if abs(pos[0] - simulation_box.get_center()[0]) > 2.5:
                    velocities[i][0] *= -1
                if abs(pos[1] - simulation_box.get_center()[1]) > 2.5:
                    velocities[i][1] *= -1
                
                # Move particle
                animations.append(particle.animate.shift(velocities[i]))
                
                # Apply slight randomness to velocity
                velocities[i] += np.array([
                    random.uniform(-0.01, 0.01),
                    random.uniform(-0.01, 0.01),
                    0
                ])
                
                # Limit max velocity
                speed = np.linalg.norm(velocities[i])
                if speed > 0.2:
                    velocities[i] = velocities[i] * 0.2 / speed
            
            return animations
        
        # Visualize force connections between some particles
        def visualize_forces():
            connections = []
            
            # Connect particles that are close to each other
            for i, p1 in enumerate(particles):
                for j, p2 in enumerate(particles[i+1:], i+1):
                    dist = np.linalg.norm(p1.get_center() - p2.get_center())
                    
                    # Connect nearby particles
                    if dist < 1.0:
                        line = Line(p1.get_center(), p2.get_center(), stroke_opacity=0.3)
                        connections.append(line)
            
            return connections
        
        # Thread activity visualization
        def thread_activity():
            animations = []
            
            # Randomly activate/deactivate threads
            for thread_group in threads:
                thread = thread_group[0]
                opacity = random.uniform(0.4, 1.0)
                animations.append(thread.animate.set_fill(opacity=opacity))
                
                # Highlight which particles are being processed by this thread
                if random.random() > 0.5:
                    start_idx = random.randint(0, num_particles - 10)
                    thread_particles = particles[start_idx:start_idx+10]
                    
                    for particle in thread_particles:
                        animations.append(particle.animate.set_color(thread.get_fill_color()))
            
            return animations
        
        # Main animation loop
        for _ in range(3):
            # Update particle positions
            self.play(*update_particles(), run_time=0.5)
            
            # Draw force connections
            connections = visualize_forces()
            self.play(*[Create(line) for line in connections], run_time=0.5)
            
            # Update threads
            self.play(*thread_activity(), run_time=0.5)
            
            # Cleanup connections for next frame
            self.play(*[FadeOut(line) for line in connections], run_time=0.5)
            
            # Update particles again
            self.play(*update_particles(), run_time=0.5)
            
            # Pulse the main elements for looping effect
            self.play(
                simulation_box.animate.scale(1.05),
                run_time=0.5
            )
            self.play(
                simulation_box.animate.scale(1/1.05),
                run_time=0.5
            )
            
        self.wait(1)