// REUSED CLASSES
const alertContainerClass = 'closing';
const checkboxHiddenClass = 'hidden';
const markedCompleteClass = 'checked';
const accordionActiveClass = 'active';

// REUSABLE FUNCTIONS
// ARROW KEY PRESS FOR DROPDOWNS
const handleArrowKeyPress = (event, itemIndex, menuItems) => {
  const isLastMenuItem = itemIndex === menuItems.length - 1;
  const isFirstMenuItem = itemIndex === 0;

  const nextMenuItem = menuItems.item(itemIndex + 1);
  const previousMenuItem = menuItems.item(itemIndex - 1);

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    if (isLastMenuItem) {
      menuItems.item(0).focus();
      return;
    }
    nextMenuItem.focus();
  }

  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    if (isFirstMenuItem) {
      menuItems.item(menuItems.length - 1).focus();
      return;
    }

    previousMenuItem.focus();
  }
}

// ESCAPE KEY PRESS FOR DROPDOWNS
const handleEscapeKeyPress = (event, callback) => {
  if (event.key === 'Escape') {
    callback();
  }
}

// OPEN MENU
const openMenu = (menuBtn, menuDropdown, menuItems, escapeKeyCallback, arrowKeyCallback) => {
  menuBtn.ariaExpanded = true;
  menuItems.item(0).focus();

  menuDropdown.addEventListener('keyup', escapeKeyCallback);

  menuItems.forEach((menuItem,menuItemIndex) => {
    menuItem.addEventListener("keyup", (event) => {
      arrowKeyCallback(event, menuItemIndex);
    });
  });
}

// CLOSE MENU
const closeMenu = (menuBtn) => {
  menuBtn.ariaExpanded = false;
  menuBtn.focus();
}

// TOGGLE MENU
const toggleMenu = (isExpanded, closeCallback, openCallback) => {
  if (isExpanded) {
    closeCallback();
  } else {
    openCallback();
  }
}

// HEADER
  const notificationButton = document.querySelector('.notification-btn');
  const notificationDropdown = document.getElementById('notification-dropdown');
  const notificationMenuItems = document.querySelectorAll('.notif-menuitem');
  const profileButton = document.querySelector('.profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileMenuItems = document.querySelectorAll('.profile-menuitem');

// TOGGLE NOTIFICATIONS DISPLAY
const notificationNav = () => {
  const closeNotificationMenu = () => {
    closeMenu(notificationButton);
  }

  const handleNotificationMenuEscapeKeypress = (event) => {
    handleEscapeKeyPress(event, toggleNotificationMenu);
  }

  const handleNotificationMenuItemArrowKeyPress = (event, menuItemIndex) => {
    handleArrowKeyPress(event, menuItemIndex, notificationMenuItems);
  }

  const openNotificationMenu = () => {
    openMenu(notificationButton, notificationDropdown, notificationMenuItems, handleNotificationMenuEscapeKeypress, handleNotificationMenuItemArrowKeyPress);
  }

  const toggleNotificationMenu = () => {
    const isExpanded = notificationButton.attributes['aria-expanded'].value === 'true';
    notificationDropdown.classList.toggle('notification-active');
    toggleMenu(isExpanded, closeNotificationMenu, openNotificationMenu);
  }

  notificationButton.addEventListener('click', toggleNotificationMenu);
}

// TOGGLE NAVIGATION DISPLAY
const profileNav = () => {
  const closeProfileMenu = () => {
    closeMenu(profileButton);
  }

  const handleMenuEscapeKeypress = (event) => {
    handleEscapeKeyPress(event, toggleProfileMenu);
  }

  const handleMenuItemArrowKeyPress = (event, menuItemIndex) => {
    handleArrowKeyPress(event, menuItemIndex, profileMenuItems);
  };

  const openProfileMenu = () => {
    openMenu(profileButton, profileDropdown, profileMenuItems, handleMenuEscapeKeypress, handleMenuItemArrowKeyPress);
  }

  const toggleProfileMenu = () => {
    const isExpanded = profileButton.attributes['aria-expanded'].value === 'true';
    profileDropdown.classList.toggle('profile-active');
    toggleMenu(isExpanded, closeProfileMenu, openProfileMenu);
  }

  profileButton.addEventListener('click', toggleProfileMenu);
}

// MAIN CONTENT
const alertContainer = document.querySelector('.callout-alert');
const alertCloseButton = document.querySelector('.alert-close__btn');

// DISMISS CALLOUT ALERT
const setAlertDisplayToNone = () => {
  alertContainer.classList.add(alertContainerClass);
  setTimeout(() => {
    alertContainer.style.display = 'none';
    alertContainer.classList.remove(alertContainerClass);
  }, 1000);
};

const closeTrialAlert = () => {
  alertCloseButton.addEventListener('click', () => {
    setAlertDisplayToNone();
  });

  alertCloseButton.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      setAlertDisplayToNone();
    };
  });
}

// TOGGLE SETUP GUIDE CHECKBOXES

const openAccordionandToggleSetupCheckBoxes = () => {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const accordionItemTitles = document.querySelectorAll('.accordion-item__title');
  const tabElements = document.querySelectorAll('button[role="tab"]');
  const panelElements = document.querySelectorAll('[role="tabpanel"]');
  const checkboxItems = document.querySelectorAll('.setup-checkbox');
  const checkboxMarkStatus = document.getElementById('checkbox-items-status');
  const loadingLabel = 'Loading. Please wait...';
  let activeIndex = 0;

  const replaceAriaLabel = (checkbox) => {
    checkbox.ariaLabel.replace('Mark', 'marked');
  };

  const markCheckboxAsComplete = (checkbox, notCompleteIcon, loadingIcon, completeIcon) => {
    checkboxMarkStatus.ariaLabel = loadingLabel;

    notCompleteIcon.classList.add(checkboxHiddenClass);
    loadingIcon.classList.remove(checkboxHiddenClass);
    setTimeout(() => {
      loadingIcon.classList.add(checkboxHiddenClass);
      completeIcon.classList.remove(checkboxHiddenClass);

      checkbox.classList.add(markedCompleteClass);
      checkbox.ariaLabel = checkbox.ariaLabel.replace('as incomplete', 'as complete');
  
      checkboxMarkStatus.ariaLabel = `Successfully ${replaceAriaLabel(checkbox)}`;
    }, 1000);
  };

  const markCheckboxAsIncomplete = (checkbox, notCompleteIcon, loadingIcon, completeIcon) => {
    checkboxMarkStatus.ariaLabel = loadingLabel;

    completeIcon.classList.add(checkboxHiddenClass);
    loadingIcon.classList.remove(checkboxHiddenClass);

    setTimeout(() => {
      loadingIcon.classList.add(checkboxHiddenClass);
      notCompleteIcon.classList.remove(checkboxHiddenClass);

      checkbox.classList.remove(markedCompleteClass);
      checkbox.ariaLabel = checkbox.ariaLabel.replace('as complete', 'as incomplete');

      checkboxMarkStatus.ariaLabel = `Successfully ${replaceAriaLabel(checkbox)}`;
    }, 1000);
  };

  const toggleCompleteCheckbox = (checkbox) => {
    const notCompleteIcon = checkbox.querySelector('.not-complete-icon');
    const loadingIcon = checkbox.querySelector('.loading-icon');
    const completeIcon = checkbox.querySelector('.complete-icon');

    if (checkbox.classList.contains(markedCompleteClass)) {
      markCheckboxAsIncomplete(checkbox, notCompleteIcon, loadingIcon, completeIcon);
    } else {
      markCheckboxAsComplete(checkbox, notCompleteIcon, loadingIcon, completeIcon);
    };
  };

  checkboxItems.forEach((checkbox) => {
    // CLICK EVENT
    checkbox.addEventListener('click', () => {
      toggleCompleteCheckbox(checkbox);
    });
  });

  const setTabIndexForInnerItems = (itemIndex) => {
    for (let i = 0; i < accordionItemTitles.length; i++) {
      if (i === itemIndex) {
        // set tab index for inner elements
        const items = accordionItems[i].querySelectorAll('.item-content__action');
        items.forEach((item) => {
          item.tabIndex = "0";
        });
      } else {
        // set tab index for inner elements
        const items = accordionItems[i].querySelectorAll('.item-content__action');
        items.forEach((item) => {
          item.tabIndex = "-1";
        });
      };
    };
  };

  function setActivePanel(index) {
    // Hide currently active panel
    accordionItems[activeIndex].classList.remove(accordionActiveClass);
    panelElements[activeIndex].tabIndex = -1;
    // Show new active panel
    accordionItems[index].classList.add(accordionActiveClass);
    panelElements[index].tabIndex = 0;
    accordionItemTitles[index].focus();
    setTabIndexForInnerItems(index);
  }

  function setActiveTab(index) {
    // Make currently active tab inactive
    tabElements[activeIndex].setAttribute("aria-selected", "false");
  
    // Set the new tab as active
    tabElements[index].setAttribute("aria-selected", "true");
  
    setActivePanel(index);
    activeIndex = index;
  }

  tabElements.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      setActiveTab(index);
    });

    // KEY PRESS
    tab.addEventListener("keydown", (event) => {
      const lastIndex = tabElements.length - 1;

      if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
        event.preventDefault();
  
        if (activeIndex === 0) {
          // First element, jump to end
          setActiveTab(lastIndex);
        } else {
          // Move left
          setActiveTab(activeIndex - 1);
        }
      } else if (event.code === "ArrowRight" || event.code === "ArrowDown") {
        event.preventDefault();
  
        if (activeIndex === lastIndex) {
          // Last element, jump to beginning
          setActiveTab(0);
        } else {
          // Move right
          setActiveTab(activeIndex + 1);
        }
      }
    });
  })

  // UPDATE PROGRESS BAR
  const observer = new MutationObserver(callback);

  // Creates the callback function for the observer
  function callback () {
    const progressBarContainer = document.querySelector('.setup-progress__bar');
    const completedCheck = document.querySelectorAll('.setup-checkbox.checked');
    const allChecks = document.querySelectorAll('.setup-checkbox');
    const progressLabel = progressBarContainer.getElementsByTagName('label')[0];
    const progressBar = document.getElementById('setup-progress');

    progressLabel.innerText = `${completedCheck.length}/5 completed`;
    progressBar.value = `${completedCheck.length / 5 * 100}`;
  
    for (let index = 0; index < allChecks.length; index++) {
      if (!allChecks[index].classList.contains('checked')) {
        setActiveTab(index);
        break;
      }
    }
  }
  
  //Sets the configuration for the observation of an Target (Looking for attributes, childs and cd)
  const config = { attributes: true, childList: true, characterData: true };
  
  // adding the observer to every target with the class
  for (let i = 0; i < checkboxItems.length; i++) {
    observer.observe(checkboxItems[i], config);  
  }
}

// DISPLAY SETUP GUIDE TAB CONTENT


// navigatePageWithArrowKeys();
notificationNav();
profileNav();
closeTrialAlert();
openAccordionandToggleSetupCheckBoxes();
