import torch
import time
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration


class CaptionModel:
    def __init__(self):
        self.device = torch.device("cpu")
        self.processor = None
        self.model = None  # NOT loaded yet — deferred until first request

    def _load(self):
        """Loads and quantizes the model only once, on first actual use."""
        if self.model is not None:
            return

        print("Loading BLIP model (first request)...")

        self.processor = BlipProcessor.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )

        model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )

        # Dynamic INT8 quantization of Linear layers — reduces memory
        # footprint of the text-decoder weights (the largest part of the model).
        model = torch.quantization.quantize_dynamic(
            model, {torch.nn.Linear}, dtype=torch.qint8
        )

        model.eval()
        self.model = model.to(self.device)

    def generate(self, image_path):
        self._load()

        image = Image.open(image_path).convert("RGB")
        image.thumbnail((512, 512))

        inputs = self.processor(
            image,
            return_tensors="pt"
        ).to(self.device)

        start = time.time()

        with torch.inference_mode():
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


caption_model = CaptionModel()  # instance created immediately, but heavy loading is deferred