first make an animation in blender
export the frames
import to TexturePackerGUI

export json and spritesheet

create .gif for emoji

# create static gif for unlockables

### create alpha.gif
convert static_resized.gif -coalesce -alpha extract null: \( peachy.gif  -alpha extract \) -compose multiply -layers composite alpha.gif

### create output.gif
convert static_resized.gif null: alpha.gif -alpha off -compose copy_opacity -layers composite -alpha on output.gif

edit output.gif manually
