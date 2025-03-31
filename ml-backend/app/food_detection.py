import google.generativeai as genai
import os
from PIL import Image
import cv2
import json
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# Load API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)
def detect_food_with_gemini(image_path):
    """
    Sends image to Gemini Pro Vision for food detection, stock estimation, and spoilage detection.
    """
    try:
        # Open the image using Pillow
        image = Image.open(image_path)
        
        model = genai.GenerativeModel("gemini-1.5-pro")
        
        # Define structured prompt for ingredient detection with spoilage status
        prompt = (
            "Detect all food items present in this image and provide their names along with estimated quantities "
            "(as integers), overall spoilage status (true or false) and expiration date if it is a packaged food. "
            "If not packaged, return null for expiration date. "
            "Format the response as JSON: {\"items\": [{\"name\": \"Apple\", \"quantity\": 5, \"spoiled\": false, \"expiration_date\": null}, "
            "{\"name\": \"Milk Carton\", \"quantity\": 1, \"spoiled\": true, \"expiration_date\": \"2024-12-01\"}]}" 
        )
        
        response = model.generate_content([image, prompt])
        
        #print("Gemini Response:", response.text)
    
        return response.text
        
    except Exception as e:
        print("Error in detect_food_with_gemini:", e)
        return []


def process_video(video_path):
    """ Reads video and extracts frames every 10 seconds for analysis. """
    cap = cv2.VideoCapture(video_path)
    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
    frame_interval = frame_rate * 15  # Extract frame every 10 seconds
    frame_count = 0
    
    # Create a list to store all inventory results
    all_inventories = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            image_path = "temp_frame.jpg"
            cv2.imwrite(image_path, frame)

            # Get the response as string from Gemini
            inventory_text = detect_food_with_gemini(image_path)
            
            try:
                # Clean the response by removing markdown code block formatting if present
                if "```json" in inventory_text and "```" in inventory_text:
                    # Extract just the JSON content between the triple backticks
                    json_start = inventory_text.find("```json") + 7  # Skip past ```json
                    json_end = inventory_text.rfind("```")
                    inventory_text = inventory_text[json_start:json_end].strip()
                
                # Try to parse the cleaned JSON string
                inventory_dict = json.loads(inventory_text)
                # Print for debugging
                print(json.dumps(inventory_dict, indent=4))
                
                # Add to our collection
                all_inventories.append(inventory_dict)
                
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON from Gemini: {e}")
                print(f"Raw response: {inventory_text}")

        frame_count += 1

    cap.release()
    cv2.destroyAllWindows()
    
    # Clean up temporary files
    if os.path.exists("temp_frame.jpg"):
        os.remove("temp_frame.jpg")
    
    # Return the collected inventory data
    return {"frames": all_inventories}

