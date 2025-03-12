import matplotlib
matplotlib.use('Agg')  # non-interactive backend
import matplotlib.pyplot as plt
import io
from flask import Flask, request, Response
from flask_cors import CORS
import numpy as np

app = Flask(__name__)  # Create a Flask app
CORS(app)  # Enable CORS


@app.route("/vector")  # Create a route
def plot_vector():
    x = request.args.get('x', type=int)  # Get the x value from the URL
    y = request.args.get('y', type=int)  # Get the y value from the URL

    ############################# Vector #############################

    fig, ax = plt.subplots()  # Create a figure and axis
    ax.set_aspect('equal') # Set the aspect ratio of the plot to be equal
    ax.set_xticks(np.arange(-10, 11, 1)) # Set the x-axis ticks
    ax.set_yticks(np.arange(-10, 11, 1)) # Set the y-axis ticks
    ax.quiver(0, 0, x, y, angles='xy', scale_units='xy', scale=1, color='red', zorder=2)  # Plot the vector with length and color
    ax.set_xlim(-10, 10)  # Set the x-axis limits
    ax.set_ylim(-10, 10)  # Set the y-axis limits
    ax.axhline(0, color='black', lw=1, zorder=1)  # Add the x-axis
    ax.axvline(0, color='black', lw=1, zorder=1)  # Add the y-axis
    ax.grid(True, zorder=0)  # Add a grid with lower z-order
    ax.text(x + 0.5, y + 0.5, f'({x}, {y})', fontsize=9, color='red', ha='center')

    ###########################################################################

    # Save the SVG image to a byte stream
    img_stream = io.BytesIO()
    fig.savefig(img_stream, format='svg')
    img_stream.seek(0)

    # Return the SVG image
    return Response(img_stream.getvalue(), content_type='image/svg+xml')


@app.route("/vector_sum")
def plot_vector_sum():
    x1 = request.args.get('x1', type=int)
    y1 = request.args.get('y1', type=int) 
    x2 = request.args.get('x2', type=int)  
    y2 = request.args.get('y2', type=int)  

    if x1 is None or y1 is None or x2 is None or y2 is None:
        return Response("Wrong input", status=400)

    ############################# Vector Sum #############################
    
    fig, ax = plt.subplots()
    ax.set_aspect('equal')
    ax.set_xticks(np.arange(-10, 11, 1))
    ax.set_yticks(np.arange(-10, 11, 1))
    ax.quiver(0, 0, x1, y1, angles='xy', scale_units='xy', scale=1, color='blue', zorder=2, label='Vector 1')
    ax.quiver(x1, y1, x2, y2, angles='xy', scale_units='xy', scale=1, color='green', zorder=2, label='Vector 2')
    ax.quiver(0, 0, x1 + x2, y1 + y2, angles='xy', scale_units='xy', scale=1, color='red', zorder=2, label='Sum of Vector 1 and Vector 2')
    ax.set_xlim(-10, 10)
    ax.set_ylim(-10, 10) 
    ax.axhline(0, color='black', lw=1, zorder=1) 
    ax.axvline(0, color='black', lw=1, zorder=1)
    ax.grid(True, zorder=0)
    ax.legend()

    ###########################################################################

    # Save the SVG image to a byte stream
    img_stream = io.BytesIO()
    fig.savefig(img_stream, format='svg')
    img_stream.seek(0)

    # Return the SVG image
    return Response(img_stream.getvalue(), content_type='image/svg+xml')


@app.route("/projection2d")
def plot_projection():
    x1 = request.args.get('x1', type=int)
    y1 = request.args.get('y1', type=int) 
    x2 = request.args.get('x2', type=int)  
    y2 = request.args.get('y2', type=int)  

    if x1 is None or y1 is None or x2 is None or y2 is None:
        return Response("Wrong input", status=400)

    ############################# Vector Projection #############################
    
    v1 = np.array([x1, y1])
    v2 = np.array([x2, y2])

    projection = (np.dot(v1, v2) / np.dot(v2, v2)) * v2

    fig, ax = plt.subplots()
    ax.quiver(0, 0, x1, y1, angles='xy', scale_units='xy', scale=1, color='blue', zorder=2, label='Vector 1')
    ax.quiver(0, 0, x2, y2, angles='xy', scale_units='xy', scale=1, color='green', zorder=2, label='Vector 2')
    ax.quiver(0, 0, projection[0], projection[1], angles='xy', scale_units='xy', scale=1, color='red', zorder=2, label='Projection of Vector 1 onto Vector 2')
    
    # Add dotted gray line from the tip of vector 1 to the projection point
    ax.plot([x1, projection[0]], [y1, projection[1]], linestyle='--', color='gray', zorder=2)

    ax.set_aspect('equal')
    ax.set_xlim(-10, 10)
    ax.set_ylim(-10, 10) 
    ax.set_xticks(np.arange(-10, 11, 1))
    ax.set_yticks(np.arange(-10, 11, 1))
    ax.axhline(0, color='black', lw=1, zorder=1) 
    ax.axvline(0, color='black', lw=1, zorder=1)
    ax.grid(True, zorder=0)
    ax.legend()

    ###########################################################################

    # Save the SVG image to a byte stream
    img_stream = io.BytesIO()
    fig.savefig(img_stream, format='svg')
    img_stream.seek(0)

    # Return the SVG image
    return Response(img_stream.getvalue(), content_type='image/svg+xml')


# Run the py backend
if __name__ == "__main__":
    app.run()
