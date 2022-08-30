#version 330 core

in vec2 uv;

out vec4 color;

uniform sampler2D sam;

void main() {
	vec4 c = texture(sam, uv);
	if (c.a < 0.1f) {
		discard;
	}
	color = c;
}