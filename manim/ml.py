from manim import *

class MLProjectAnimation(Scene):
    def construct(self):
        # Create a title
        title = Text("Machine Learning", font_size=40)
        title.to_edge(UP)
        
        # Create the skills text
        skills = Text("Skills: Machine Learning, TensorFlow, AWS, CNN", 
                     font_size=24, color=BLUE)
        skills.next_to(title, DOWN, buff=0.5)
        
        # Create lung X-ray visualization
        lung_square = Square(side_length=4, color=WHITE)
        lung_image = ImageMobject("lung_xray_placeholder.png").scale(0.8)
        lung_image.move_to(lung_square.get_center())
        
        lung_group = Group(lung_square, lung_image)
        lung_group.shift(DOWN * 0.5)
        
        # Create CNN architecture visualization
        layers = VGroup()
        
        # Input layer
        input_layer = Rectangle(height=3, width=0.5, fill_opacity=0.7, fill_color=BLUE_E)
        
        # Convolutional layers
        conv_layers = VGroup()
        for i in range(3):
            layer = Rectangle(height=2.5-i*0.5, width=0.5, 
                             fill_opacity=0.7, fill_color=GREEN_E)
            conv_layers.add(layer)
        
        # Dense/Output layers
        dense_layers = VGroup()
        for i in range(2):
            layer = Rectangle(height=1-i*0.4, width=0.5, 
                             fill_opacity=0.7, fill_color=RED_E)
            dense_layers.add(layer)
        
        # Final prediction (binary output)
        output = VGroup(
            Rectangle(height=0.4, width=0.4, fill_opacity=1, fill_color=GREEN_A),
            Text("Healthy", font_size=14).scale(0.4),
            Rectangle(height=0.4, width=0.4, fill_opacity=1, fill_color=RED_A),
            Text("COVID-19", font_size=14).scale(0.4)
        )
        
        # Arrange network architecture
        layers.add(input_layer)
        layers.add(conv_layers)
        layers.add(dense_layers)
        
        for i, layer in enumerate(layers):
            if i > 0:
                layer.next_to(layers[i-1], RIGHT, buff=0.3)
        
        output[0].next_to(dense_layers, RIGHT, buff=0.3)
        output[1].next_to(output[0], RIGHT, buff=0.1)
        output[2].next_to(output[1], RIGHT, buff=0.2)
        output[3].next_to(output[2], RIGHT, buff=0.1)
        
        layers.add(output)
        layers.scale(0.8)
        
        # Position elements
        network_title = Text("CNN Architecture", font_size=20)
        network_title.next_to(layers, UP, buff=0.3)
        
        network_group = VGroup(network_title, layers)
        network_group.shift(RIGHT * 3 + DOWN * 0.5)
        
        # Animation sequence
        self.play(Write(title))
        self.play(Write(skills))
        self.wait(0.5)
        self.play(Create(lung_square), FadeIn(lung_image))
        
        # Animate data flowing through CNN
        self.play(Create(input_layer))
        
        # Animation for convolutional processing
        for layer in conv_layers:
            self.play(Create(layer))
            
            # Animate feature extraction
            feature_dots = VGroup(*[Dot(radius=0.05, color=YELLOW) 
                                  for _ in range(10)])
            feature_dots.arrange_in_grid(rows=5, cols=2, buff=0.1)
            feature_dots.move_to(layer.get_center())
            self.play(FadeIn(feature_dots, lag_ratio=0.1))
            self.play(FadeOut(feature_dots))
        
        # Animation for dense layers
        for layer in dense_layers:
            self.play(Create(layer))
        
        # Animation for output prediction
        self.play(FadeIn(output))
        
        # Pulsing effect for main elements to create the looping animation
        self.play(
            *[ApplyMethod(mob.scale, 1.05) for mob in [lung_group, network_group]],
            run_time=1
        )
        self.play(
            *[ApplyMethod(mob.scale, 1/1.05) for mob in [lung_group, network_group]],
            run_time=1
        )
        
        # Create looping animation effect
        for _ in range(2):
            # Data flow animation
            data_flow = []
            
            # From X-ray to input layer
            arrow1 = Arrow(lung_group.get_right(), input_layer.get_left())
            data_flow.append(ShowCreation(arrow1))
            
            # Through the network
            for i in range(len(layers) - 1):
                if isinstance(layers[i], VGroup) and isinstance(layers[i+1], VGroup):
                    arrow = Arrow(layers[i][-1].get_right(), layers[i+1][0].get_left())
                elif isinstance(layers[i], VGroup):
                    arrow = Arrow(layers[i][-1].get_right(), layers[i+1].get_left())
                elif isinstance(layers[i+1], VGroup):
                    arrow = Arrow(layers[i].get_right(), layers[i+1][0].get_left())
                else:
                    arrow = Arrow(layers[i].get_right(), layers[i+1].get_left())
                data_flow.append(ShowCreation(arrow))
            
            # Animate data flow
            self.play(*data_flow)
            self.play(*[FadeOut(arrow) for arrow in data_flow])
            
            # Pulse animation for looping effect
            self.play(
                *[ApplyMethod(mob.scale, 1.05) for mob in [lung_group, network_group]],
                run_time=1
            )
            self.play(
                *[ApplyMethod(mob.scale, 1/1.05) for mob in [lung_group, network_group]],
                run_time=1
            )
            
        self.wait(1)