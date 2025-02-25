# ########## dynamic_forms settings ##########
import os
from django.conf import settings
# TinyMCE API Key
TINY_MCE_API_KEY = "rdx7xzftrpc6uk4ogngp370bh8q1e5tdm9e4r3fvbmvnsgls"
# TinyMCE configurations
TINYMCE_JS_URL = "tinymce/tinymce.min.js"
TINYMCE_JS_ROOT = os.path.join(settings.STATIC_URL, "tinymce")
TINYMCE_DEFAULT_CONFIG = {
    "branding": False,
    "height": "320px",
    "width": "100%",
    "menubar": "file edit view insert format tools table help",
    # "menubar": False,
    "plugins": "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount spellchecker",
    # "plugins": "code",
    "toolbar": "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft "
    "aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor "
    "backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | "
    "fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | "
    "a11ycheck ltr rtl | showcomments addcomment code",
    "custom_undo_redo_levels": 10,
    "codesample_global_prismjs": True,
    # "language": "en_US",  # To force a specific language instead of the Django current language.
}
TINYMCE_SPELLCHECKER = True
TINYMCE_COMPRESSOR = False
TINYMCE_EXTRA_MEDIA = {}

# Apps related to additional libraries
DEPENDENCY_APPS = [
    "tinymce",
]

# Apps that contain models that would be considered to make forms with
FORM_APPS = []

# Model Forms classes for each app's model
# Dynamically added with form decorator above each app's model form
MODEL_FORMS = []
