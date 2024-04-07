from PIL import Image, ImageFont, ImageDraw

# Global Variables
FONT_FILE = ImageFont.truetype(r'font/GreatVibes-Regular.ttf', 180)
FONT_COLOR = "#FFFFFF"
COURSEFONT_FILE = ImageFont.truetype(r'coursefont/OpenSauceSans-Regular.ttf', 40)
SIGNATURE_PATH = "sign.png"

template = Image.open(r'cert.png')
WIDTH, HEIGHT = template.size

def make_certificates(name, signature_path):
    '''Function to save certificates as a .png file'''

    image_source = template.copy()
    draw = ImageDraw.Draw(image_source)
    
    # Finding the width of the text.
    name_width = draw.textlength(name, font=FONT_FILE)
    course_width = draw.textlength(course, font=COURSEFONT_FILE)

    # Placing it in the center, then making some adjustments.
    draw.text(((WIDTH - name_width) / 2, (HEIGHT - FONT_FILE.size) / 2 ), name, fill=FONT_COLOR, font=FONT_FILE)
    draw.text(((WIDTH - course_width) / 2 , (HEIGHT - COURSEFONT_FILE.size) / 2 +205), course, fill=FONT_COLOR, font=COURSEFONT_FILE)

    # Adding the signature
    signature = Image.open(signature_path)
    signature_width, signature_height = signature.size
    image_source.paste(signature, ((WIDTH - signature_width) // 2, HEIGHT - signature_height -115), signature)

    # Saving the certificates in a different directory.
    image_source.save("./out/" + name + ".png")
    print('Saving Certificate of:', name)        

if __name__ == "__main__":

    names = ['Hrishikesh Narayanan', "Kenz Abdulla"]
    course = "Computer Programming"
    for name in names:
        make_certificates(name, SIGNATURE_PATH)

    print(len(names), "certificates done.")
