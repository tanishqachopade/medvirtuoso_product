FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git \
    lazarus \
    fp-compiler \
    build-essential \
    wget \
    unzip \
    xvfb \
    x11vnc \
    fluxbox \
    novnc \
    websockify \
    supervisor \
    libgtk-3-0 \
    libgtk2.0-0 \
    libgl1-mesa-glx \
    libglu1-mesa \
    libxrender1 \
    libxtst6 \
    libxi6 \
    libxrandr2 \
    libxinerama1 \
    libxcursor1 \
    libcanberra-gtk-module \
    && apt-get clean

WORKDIR /app

RUN git clone https://github.com/tanishqachopade/MRIcroGL-MedMarvel.git /app/MRIcroGL

WORKDIR /app/MRIcroGL

# Build MRIcroGL
RUN lazbuild MRIcroGL.lpi

# Make executable
RUN chmod +x /app/MRIcroGL/MRIcroGL

# Copy supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 6080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]