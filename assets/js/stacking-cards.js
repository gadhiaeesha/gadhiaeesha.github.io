/**
 * Stacking Cards Component
 * Based on CodyHouse stacking cards tutorial
 * Creates a sticky stacking cards scroll effect
 */

var StackingCards = function(element, cardsData) {
  // Accept either element ID (string) or DOM element
  if (typeof element === 'string') {
    this.element = document.getElementById(element);
  } else {
    this.element = element;
  }
  this.cardsData = cardsData;
  this.items = [];
  this.scrollingListener = false;
  this.scrolling = false;
  this.cardTop = 120; // top value for sticky position (accounting for header)
  this.cardHeight = 0;
  this.marginY = 20; // gap between cards
  this.init();
};

StackingCards.prototype.init = function() {
  if (!this.element) {
    console.error('StackingCards: Element not found');
    return;
  }
  
  if (!this.cardsData || this.cardsData.length === 0) {
    console.error('StackingCards: No cards data provided');
    return;
  }
  
  // Create ul element
  const list = document.createElement('ul');
  list.className = 'stack-cards js-stack-cards';
  
  // Create card items
  this.cardsData.forEach((cardData, index) => {
    const item = this.createCard(cardData, index);
    list.appendChild(item);
    this.items.push(item);
  });
  
  this.element.appendChild(list);
  
  // Wait for images to load to get accurate card height
  setTimeout(() => {
    this.waitForImages().then(() => {
      this.cardHeight = this.items[0].offsetHeight || 600;
      // Set container height to allow scrolling through all cards
      // Each card needs space to scroll through, but minimize space after last card
      const containerHeight = this.cardHeight + (this.items.length - 1) * (this.cardHeight + this.marginY);
      this.element.style.height = `${containerHeight}px`;
      this.initStackCardsEffect();
    });
  }, 100);
};

StackingCards.prototype.createCard = function(cardData, index) {
  const item = document.createElement('li');
  item.className = 'stack-cards__item js-stack-cards__item';
  
  const content = document.createElement('div');
  content.className = 'stack-cards__content';
  
  // Create two-column layout for description
  const descriptionWrapper = document.createElement('div');
  descriptionWrapper.className = 'stack-cards__description-wrapper';
  
  const title = document.createElement('div');
  title.className = 'stack-cards__title';
  title.textContent = cardData.title || `Version ${index + 1}`;
  
  const description = document.createElement('div');
  description.className = 'stack-cards__description';
  description.textContent = cardData.description || '';
  
  descriptionWrapper.appendChild(title);
  descriptionWrapper.appendChild(description);
  
  const image = document.createElement('img');
  image.src = cardData.image;
  image.alt = cardData.alt || `Design prototype ${index + 1}`;
  image.className = 'stack-cards__image';
  
  content.appendChild(descriptionWrapper);
  item.appendChild(content);
  item.appendChild(image);
  
  // Set initial translateY offset based on index
  item.style.transform = `translateY(${this.marginY * index}px)`;
  
  return item;
};

StackingCards.prototype.waitForImages = function() {
  const images = [];
  this.items.forEach(item => {
    const img = item.querySelector('img');
    if (img) images.push(img);
  });
  
  if (images.length === 0) return Promise.resolve();
  
  const imagePromises = images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });
  return Promise.all(imagePromises);
};

StackingCards.prototype.initStackCardsEffect = function() {
  const intersectionObserverSupported = (
    'IntersectionObserver' in window && 
    'IntersectionObserverEntry' in window && 
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  );
  
  if (!intersectionObserverSupported) {
    // Fallback: just add scroll listener
    this.stackCardsInitEvent();
    return;
  }
  
  // Use Intersection Observer to trigger animation
  const observer = new IntersectionObserver(this.stackCardsCallback.bind(this), {
    threshold: 0
  });
  observer.observe(this.element);
};

StackingCards.prototype.stackCardsCallback = function(entries) {
  if (entries[0].isIntersecting) {
    // Cards inside viewport - add scroll listener
    if (this.scrollingListener) return; // listener already added
    this.stackCardsInitEvent();
  } else {
    // Cards not inside viewport - remove scroll listener
    if (!this.scrollingListener) return; // listener already removed
    window.removeEventListener('scroll', this.scrollingListener);
    this.scrollingListener = false;
  }
};

StackingCards.prototype.stackCardsInitEvent = function() {
  this.scrollingListener = this.stackCardsScrolling.bind(this);
  window.addEventListener('scroll', this.scrollingListener, { passive: true });
};

StackingCards.prototype.stackCardsScrolling = function() {
  if (this.scrolling) return;
  this.scrolling = true;
  window.requestAnimationFrame(this.animateStackCards.bind(this));
};

StackingCards.prototype.animateStackCards = function() {
  const top = this.element.getBoundingClientRect().top;
  
  for (let i = 0; i < this.items.length; i++) {
    // Calculate how much this card has scrolled
    const scrolling = this.cardTop - top - i * (this.cardHeight + this.marginY);
    
    if (scrolling > 0) {
      // Card is fixed - scale it down
      const scale = (this.cardHeight - scrolling * 0.05) / this.cardHeight;
      const translateY = this.marginY * i;
      this.items[i].setAttribute('style', `transform: translateY(${translateY}px) scale(${Math.max(0.8, scale)});`);
    } else {
      // Card is not fixed yet - keep initial position
      const translateY = this.marginY * i;
      this.items[i].setAttribute('style', `transform: translateY(${translateY}px) scale(1);`);
    }
  }
  
  this.scrolling = false;
};

// Export for use in HTML
window.StackingCards = StackingCards;
