from manim import *

class FullStackAnimation(Scene):
    def construct(self):
        # Create a title
        title = Text("Full Stack", font_size=40)
        title.to_edge(UP)
        
        # Create the skills text
        skills = Text("Skills: Swift, Objective-C, Node.js, SQL", 
                     font_size=24, color=BLUE)
        skills.next_to(title, DOWN, buff=0.5)
        
        # Create iOS app interface mockup
        phone_outline = RoundedRectangle(
            height=4, width=2, corner_radius=0.2, 
            stroke_color=WHITE, fill_opacity=0.2, fill_color=GRAY
        )
        
        # App interface elements
        app_header = Rectangle(height=0.4, width=1.8, fill_opacity=1, fill_color=BLUE_E)
        app_header.move_to(phone_outline.get_top() + DOWN * 0.25)
        
        app_title = Text("Fitness Dashboard", font_size=14).scale(0.5)
        app_title.move_to(app_header)
        
        # Dashboard elements
        charts_section = Rectangle(height=1.5, width=1.8, fill_opacity=0.8, fill_color=DARK_GRAY)
        charts_section.next_to(app_header, DOWN, buff=0.05)
        
        chart = Circle(radius=0.5, color=GREEN, fill_opacity=0.5)
        chart.move_to(charts_section.get_center())
        chart_data = ArcBetweenPoints(
            chart.get_bottom(), chart.get_right(), angle=TAU/4
        ).set_color(GREEN_A)
        
        # Workout builder section
        workout_section = Rectangle(height=1.8, width=1.8, fill_opacity=0.8, fill_color=GRAY)
        workout_section.next_to(charts_section, DOWN, buff=0.05)
        
        # Workout items
        workout_items = VGroup()
        for i in range(3):
            item = Rectangle(height=0.3, width=1.6, fill_opacity=1, fill_color=BLUE_D)
            workout_items.add(item)
        
        workout_items.arrange(DOWN, buff=0.1)
        workout_items.move_to(workout_section)
        
        # Backend visualization
        server = Rectangle(height=2, width=1.5, fill_opacity=0.8, fill_color=GREEN_E)
        server.shift(RIGHT * 3)
        
        server_text = Text("Node.js\nServer", font_size=20)
        server_text.move_to(server)
        
        database = Circle(radius=1, fill_opacity=0.8, fill_color=BLUE_E)
        database.next_to(server, DOWN, buff=1)
        
        db_text = Text("PostgreSQL", font_size=20)
        db_text.move_to(database)

        # Group front and backend
        frontend = VGroup(phone_outline, app_header, app_title, charts_section, chart, chart_data, workout_section, workout_items)
        frontend.shift(LEFT * 3)
        
        backend = VGroup(server, server_text, database, db_text)
        
        # Animation sequence
        self.play(Write(title))
        self.play(Write(skills))
        self.wait(0.5)
        
        # Frontend animation
        self.play(Create(phone_outline))
        self.play(FadeIn(app_header), Write(app_title))
        self.play(FadeIn(charts_section))
        self.play(Create(chart), Create(chart_data))
        self.play(FadeIn(workout_section))
        self.play(FadeIn(workout_items))
        
        # Backend animation
        self.play(Create(server), Write(server_text))
        self.play(Create(database), Write(db_text))
        
        # Looping animation for data flow between components
        for _ in range(3):
            # User authentication flow
            auth_data = Dot(color=YELLOW, radius=0.1)
            auth_data.move_to(phone_outline.get_center())
            
            # Phone to server
            self.play(auth_data.animate.move_to(server.get_left()))
            
            # Server to database (authentication check)
            query_data = Dot(color=BLUE, radius=0.1)
            query_data.move_to(server.get_bottom())
            self.play(query_data.animate.move_to(database.get_top()))
            
            # Database to server (response)
            response_data = Dot(color=GREEN, radius=0.1)
            response_data.move_to(database.get_top())
            self.play(response_data.animate.move_to(server.get_bottom()))
            
            # Server to phone (authenticated session)
            auth_response = Dot(color=GREEN, radius=0.1)
            auth_response.move_to(server.get_left())
            self.play(auth_response.animate.move_to(phone_outline.get_right()))
            
            # Workout data update
            workout_update = Dot(color=PURPLE, radius=0.1)
            workout_update.move_to(workout_items.get_center())
            
            # Phone to server (save workout)
            self.play(workout_update.animate.move_to(server.get_left()))
            
            # Server to database (save data)
            server_save = Dot(color=PURPLE, radius=0.1)
            server_save.move_to(server.get_bottom())
            self.play(server_save.animate.move_to(database.get_top()))
            
            # All elements pulse for looping effect
            self.play(
                *[ApplyMethod(mob.scale, 1.05) for mob in [frontend, backend]],
                run_time=1
            )
            self.play(
                *[ApplyMethod(mob.scale, 1/1.05) for mob in [frontend, backend]],
                run_time=1
            )
            
            # Clear animation dots before next loop
            self.remove(auth_data, query_data, response_data, auth_response, workout_update, server_save)
        
        self.wait(1)