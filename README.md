# Custom Action Mission Game (TEXT VERSION)

This project consists of a React frontend and a Flask backend that together create a dynamic AI-powered storytelling experience.

## Project Structure

- `drama-app/`: Contains the React frontend application.
- `drama-backend/`: Contains the Flask backend application.
- `project_documentation.md`: Comprehensive documentation about the project.
- `story_logic_flow.md`: Details the story logic and flow.
- `ui_wireframe_design.md`: Describes the UI wireframes and component layout.
- `story_templates_examples.md`: Provides examples of story tone templates and a full drama run.

## How to Run the Application Locally

Follow these steps to set up and run the application on your local machine.

### 1. Backend Setup (Flask)

1.  **Navigate to the backend directory:**
    ```bash
    cd drama-backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask backend server:**
    ```bash
    python src/main.py
    ```
    The backend server will typically run on `http://127.0.0.1:5000`.

### 2. Frontend Setup (React)

1.  **Navigate to the frontend directory (in a new terminal tab/window):**
    ```bash
    cd drama-app
    ```

2.  **Install Node.js dependencies using pnpm:**
    ```bash
    pnpm install
    ```

3.  **Build the React frontend for production:**
    ```bash
    pnpm run build
    ```
    This will create a `dist` folder inside `drama-app` with the optimized production build.

4.  **Copy the built frontend to the Flask static directory:**
    ```bash
    cp -r dist/* ../drama-backend/src/static/
    ```
    **Note**: Ensure your Flask backend is running before performing this step, as the Flask server serves the static files.

### 3. Access the Application

Once both the backend and frontend are set up and the Flask server is running, you can access the application in your web browser:

Open your browser and go to: `http://127.0.0.1:5000`

## Deployment

The application is currently deployed at: `https://vgh0i1cj95v3.manus.space`

## Contact

For any questions or issues, please refer to the `project_documentation.md` file or contact the project maintainer.

