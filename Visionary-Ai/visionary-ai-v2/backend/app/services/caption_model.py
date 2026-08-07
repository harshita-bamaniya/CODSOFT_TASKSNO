import torch
import time
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration


class CaptionModel:

    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        print(f"Using device: {self.device}")

        self.processor = BlipProcessor.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )

        self.model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        ).to(self.device)

    def generate(self, image_path):

        image = Image.open(image_path).convert("RGB")
        image.thumbnail((512, 512))

        inputs = self.processor(
            image,
            return_tensors="pt"
        ).to(self.device)

        start = time.time()

        output = self.model.generate(
            **inputs,
            max_new_tokens=25,
            num_beams=1,
            do_sample=False
        )

        print(f"Generation took {time.time() - start:.2f} seconds")

        caption = self.processor.decode(
            output[0],
            skip_special_tokens=True
        )

        return caption


caption_model = CaptionModel()