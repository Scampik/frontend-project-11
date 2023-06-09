import onChange from 'on-change';

const renderPosts = (elements, state, i18n) => {
  const postsBox = document.createElement('div');
  const postsTitleBox = document.createElement('div');
  const postsTitle = document.createElement('h2');
  const postsList = document.createElement('ul');

  postsBox.classList.add('card', 'border-0');
  postsTitleBox.classList.add('card-body');
  postsTitle.classList.add('card-title', 'h4');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  postsTitle.textContent = i18n.t('posts');

  state.posts.forEach((element) => {
    const post = document.createElement('li');
    const postTitle = document.createElement('a');
    const postButton = document.createElement('button');
    post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    postTitle.setAttribute('href', element.link);
    postTitle.classList.add('fw-bold');
    postTitle.setAttribute('data-id', element.id);
    postTitle.setAttribute('target', '_blank');
    postTitle.setAttribute('rel', 'noopener noreferrer');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#modal');
    postButton.setAttribute('data-id', element.id);

    postTitle.textContent = element.title;
    postButton.textContent = i18n.t('lookPost');

    postsList.append(post);
    post.append(postTitle, postButton);

    if (state.UIstate.viewedPosts.has(element.id)) {
      postTitle.classList.remove('fw-bold');
      postTitle.classList.add('fw-normal', 'link-secondary');
    }
  });

  elements.containers.postsContainer.replaceChildren(postsBox);
  postsBox.append(postsTitleBox);
  postsTitleBox.append(postsTitle, postsList);
};

const renderFeeds = (elements, state, i18n) => {
  const feedsBox = document.createElement('div');
  const feedsTitleBox = document.createElement('div');
  const feedsTitle = document.createElement('h2');
  const feedsList = document.createElement('ul');

  feedsBox.classList.add('card', 'border-0');
  feedsTitleBox.classList.add('card-body');
  feedsTitle.classList.add('card-title', 'h4');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  feedsTitle.textContent = i18n.t('feeds');

  state.feeds.forEach((element) => {
    const feed = document.createElement('li');
    const feedTitle = document.createElement('h3');
    const feedDescription = document.createElement('p');
    feed.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedTitle.classList.add('h6', 'm-0');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedTitle.textContent = element.title;
    feedDescription.textContent = element.description;
    feedsList.append(feed);
    feed.append(feedTitle, feedDescription);
  });

  elements.containers.feedsContainer.replaceChildren(feedsBox);
  feedsBox.append(feedsTitleBox);
  feedsTitleBox.append(feedsTitle, feedsList);
};

const renderClearState = (elements, state) => {
  if (state.form.processState === 'processing') {
    const invalidFeedback = elements.feedback;
    // elements.input.classList.remove('is-invalid');
    // elements.input.classList.remove('is-valid');
    invalidFeedback.classList.remove('text-danger');
    invalidFeedback.classList.remove('text-success');
    invalidFeedback.textContent = '';
  }
};

const renderState = (elements, state, i18n) => {
  if (state.form.processState === 'failed') {
    const validFeedback = elements.feedback;
    validFeedback.classList.remove('text-success');
    validFeedback.classList.add('text-danger');
    validFeedback.textContent = i18n.t(state.form.errors);
  }

  if (state.form.processState === 'success') {
    const invalidFeedback = elements.feedback;
    invalidFeedback.classList.remove('text-danger');
    invalidFeedback.classList.add('text-success');
    invalidFeedback.textContent = i18n.t('success');
    elements.rssForm.reset();
  }
  elements.input.focus();
};

const modalWindow = (state) => {
  const titleModal = document.querySelector('.modal-title');
  const bodyModal = document.querySelector('.modal-body');
  const btnModal = document.querySelector('.btn-primary');

  const currentId = state.UIstate.currentPostsId;
  const currentPost = state.posts.find((el) => el.id === currentId);

  const { description, link, title } = currentPost;
  const postElement = document.querySelector(`[data-id='${currentId}']`);

  if (postElement) {
    postElement.classList.remove('fw-bold');
    postElement.classList.add('fw-normal', 'link-secondary');
  }

  titleModal.textContent = title;
  bodyModal.textContent = description;
  btnModal.href = link;
};

export default (elements, state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    const mainButton = elements.mainBtn;
    const mainInput = elements.input;
    switch (value) {
      case 'success':
        renderState(elements, state, i18n);
        renderFeeds(elements, state, i18n);
        renderPosts(elements, state, i18n);
        mainButton.disabled = false;
        mainInput.disabled = false;
        break;
      case 'openModalWindow':
        modalWindow(state);
        break;
      case 'processing':
        mainButton.disabled = true;
        mainInput.disabled = true;
        renderClearState(elements, state);
        break;
      case 'filling':
        mainButton.disabled = false;
        mainInput.disabled = false;
        break;
      case 'openLink':
        renderPosts(elements, state, i18n);
        break;
      case 'failed':
        renderState(elements, state, i18n);
        mainButton.disabled = false;
        mainInput.disabled = false;
        break;
      case 'update':
        renderPosts(elements, state, i18n);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
