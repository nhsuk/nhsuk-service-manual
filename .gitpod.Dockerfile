FROM gitpod/workspace-full:latest

RUN bash -c 'VERSION="lts/jod" \
    && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
    && nvm use $VERSION && nvm alias default $VERSION'

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

RUN brew install gitleaks
