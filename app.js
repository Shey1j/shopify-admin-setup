// REUSED CLASSES
const alertContainerClass = "closing";
const checkboxHiddenClass = "hidden";
const markedCompleteClass = "checked";
const accordionActiveClass = "active";

// REUSED VALUES
const clickEvent = "click";
const keyUpEvent = "keyup";
const rightArrowKey = "ArrowRight";
const leftArrowKey = "ArrowLeft";
const upArrowKey = "ArrowUp";
const downArrowKey = "ArrowDown";
const ariaExpandedAttr = "aria-expanded";
const ariaSelectedAttr = "aria-selected";

// REUSABLE FUNCTIONS

// ARROW KEY PRESS FOR DROPDOWNS
function handleArrowKeyPress (event, itemIndex, menuItems) {
  const isLastMenuItem = itemIndex === menuItems.length - 1;
  const isFirstMenuItem = itemIndex === 0;

  const nextMenuItem = menuItems.item(itemIndex + 1);
  const previousMenuItem = menuItems.item(itemIndex - 1);

  if (event.key === rightArrowKey || event.key === downArrowKey) {
    if (isLastMenuItem) {
      menuItems.item(0).focus();
      return;
    }
    nextMenuItem.focus();
  }

  if (event.key === upArrowKey || event.key === leftArrowKey) {
    if (isFirstMenuItem) {
      menuItems.item(menuItems.length - 1).focus();
      return;
    }

    previousMenuItem.focus();
  }
};

// ESCAPE KEY PRESS FOR DROPDOWNS
function handleEscapeKeyPress (event, callback) {
  if (event.key === "Escape") {
    callback();
  }
};

// OPEN MENU
function openMenu (
  menuBtn,
  menuDropdown,
  menuItems,
  escapeKeyCallback,
  arrowKeyCallback
) {
  menuBtn.ariaExpanded = true;
  menuItems.item(0).focus();

  menuDropdown.addEventListener(keyUpEvent, escapeKeyCallback);

  menuItems.forEach((menuItem, menuItemIndex) => {
    menuItem.addEventListener(keyUpEvent, (event) => {
      arrowKeyCallback(event, menuItemIndex);
    });
  });
};

// CLOSE MENU
function closeMenu (menuBtn) {
  menuBtn.ariaExpanded = false;
  menuBtn.focus();
};

// TOGGLE MENU
function toggleMenu (isExpanded, closeCallback, openCallback) {
  if (isExpanded) {
    closeCallback();
  } else {
    openCallback();
  }
};

// HEADER
const notificationButton = document.querySelector(".notification-btn");
const notificationDropdown = document.getElementById("notification-dropdown");
const notificationMenuItems = document.querySelectorAll(".notif-menuitem");
const profileButton = document.querySelector(".profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");
const profileMenuItems = document.querySelectorAll(".profile-menuitem");

// TOGGLE NOTIFICATIONS DISPLAY
function notificationNav () {
  const closeNotificationMenu = () => {
    closeMenu(notificationButton);
  };

  const handleNotificationMenuEscapeKeypress = (event) => {
    handleEscapeKeyPress(event, toggleNotificationMenu);
  };

  const handleNotificationMenuItemArrowKeyPress = (event, menuItemIndex) => {
    handleArrowKeyPress(event, menuItemIndex, notificationMenuItems);
  };

  const openNotificationMenu = () => {
    openMenu(
      notificationButton,
      notificationDropdown,
      notificationMenuItems,
      handleNotificationMenuEscapeKeypress,
      handleNotificationMenuItemArrowKeyPress
    );
  };

  const toggleNotificationMenu = () => {
    const isExpanded =
      notificationButton.attributes[ariaExpandedAttr].value === "true";
    notificationDropdown.classList.toggle("notification-active");
    toggleMenu(isExpanded, closeNotificationMenu, openNotificationMenu);
  };

  notificationButton.addEventListener(clickEvent, toggleNotificationMenu);
};

// TOGGLE NAVIGATION DISPLAY
function profileNav () {
  const closeProfileMenu = () => {
    closeMenu(profileButton);
  };

  const handleMenuEscapeKeypress = (event) => {
    handleEscapeKeyPress(event, toggleProfileMenu);
  };

  const handleMenuItemArrowKeyPress = (event, menuItemIndex) => {
    handleArrowKeyPress(event, menuItemIndex, profileMenuItems);
  };

  const openProfileMenu = () => {
    openMenu(
      profileButton,
      profileDropdown,
      profileMenuItems,
      handleMenuEscapeKeypress,
      handleMenuItemArrowKeyPress
    );
  };

  const toggleProfileMenu = () => {
    const isExpanded =
      profileButton.attributes[ariaExpandedAttr].value === "true";
    profileDropdown.classList.toggle("profile-active");
    toggleMenu(isExpanded, closeProfileMenu, openProfileMenu);
  };

  profileButton.addEventListener(clickEvent, toggleProfileMenu);
};

// MAIN CONTENT
const alertContainer = document.querySelector(".callout-alert");
const alertCloseButton = document.querySelector(".alert-close__btn");
const accordionItems = document.querySelectorAll(".accordion-item");

// DISMISS CALLOUT ALERT

function setAlertDisplayToNone () {
  alertContainer.classList.add(alertContainerClass);
  setTimeout(() => {
    alertContainer.style.display = "none";
    alertContainer.classList.remove(alertContainerClass);
  }, 1000);
};

function closeTrialAlert () {
  alertCloseButton.addEventListener(clickEvent, setAlertDisplayToNone);
};

// TOGGLE SETUP ITEMS DISPLAY

function toggleSetupDropdown () {
  const setupAccordionWrapper = document.querySelector("#setup-accordion");
  const accordionToggleButton = document.querySelector("#toggle-btn");

  const closeSetupMenu = () => {
    closeMenu(accordionToggleButton);
  };

  const handleSetupMenuEscapeKeyPress = (event) => {
    handleEscapeKeyPress(event, toggleSetupMenu);
  };

  const handleSetupMenuItemArrowKeyPress = (event, itemIndex) => {
    handleArrowKeyPress(event, itemIndex, accordionItems);
  };

  const openSetupMenu = () => {
    openMenu(
      accordionToggleButton,
      setupAccordionWrapper,
      accordionItems,
      handleSetupMenuEscapeKeyPress,
      handleSetupMenuItemArrowKeyPress
    );
  };

  const toggleSetupMenu = () => {
    const isExpanded =
      accordionToggleButton.attributes[ariaExpandedAttr].value === "true";
    setupAccordionWrapper.classList.toggle("show");
    toggleMenu(isExpanded, closeSetupMenu, openSetupMenu);

    if (isExpanded) {
      accordionToggleButton.ariaLabel = "open setup guide";
    } else {
      accordionToggleButton.ariaLabel = "close setup guide";
    }
  };

  accordionToggleButton.addEventListener(clickEvent, toggleSetupMenu);
};

// TOGGLE SETUP GUIDE CHECKBOXES

function openAccordionandToggleSetupCheckBoxes () {
  const accordionItemTitles = document.querySelectorAll(
    ".accordion-item__title"
  );
  const tabElements = document.querySelectorAll('button[role="tab"]');
  const panelElements = document.querySelectorAll('[role="tabpanel"]');
  const checkboxItems = document.querySelectorAll(".setup-checkbox");
  const checkboxMarkStatus = document.getElementById("checkbox-items-status");
  const loadingLabel = "Loading. Please wait...";
  let activeIndex = 0;

  const replaceAriaLabel = (checkbox) => {
    return checkbox.ariaLabel.replace("Mark", "marked");
  };

  const markCheckboxAsComplete = (
    checkbox,
    notCompleteIcon,
    loadingIcon,
    completeIcon
  ) => {
    checkboxMarkStatus.ariaLabel = loadingLabel;

    notCompleteIcon.classList.add(checkboxHiddenClass);
    loadingIcon.classList.remove(checkboxHiddenClass);
    setTimeout(() => {
      loadingIcon.classList.add(checkboxHiddenClass);
      completeIcon.classList.remove(checkboxHiddenClass);

      checkbox.classList.add(markedCompleteClass);
      checkbox.ariaLabel = checkbox.ariaLabel.replace(
        "as incomplete",
        "as complete"
      );

      checkboxMarkStatus.ariaLabel = `Successfully ${replaceAriaLabel(
        checkbox
      )}`;
    }, 1000);
  };

  const markCheckboxAsIncomplete = (
    checkbox,
    notCompleteIcon,
    loadingIcon,
    completeIcon
  ) => {
    checkboxMarkStatus.ariaLabel = loadingLabel;

    completeIcon.classList.add(checkboxHiddenClass);
    loadingIcon.classList.remove(checkboxHiddenClass);

    setTimeout(() => {
      loadingIcon.classList.add(checkboxHiddenClass);
      notCompleteIcon.classList.remove(checkboxHiddenClass);

      checkbox.classList.remove(markedCompleteClass);
      checkbox.ariaLabel = checkbox.ariaLabel.replace(
        "as complete",
        "as incomplete"
      );

      checkboxMarkStatus.ariaLabel = `Successfully ${replaceAriaLabel(
        checkbox
      )}`;
    }, 1000);
  };

  const toggleCompleteCheckbox = (checkbox) => {
    const notCompleteIcon = checkbox.querySelector(".not-complete-icon");
    const loadingIcon = checkbox.querySelector(".loading-icon");
    const completeIcon = checkbox.querySelector(".complete-icon");

    if (checkbox.classList.contains(markedCompleteClass)) {
      markCheckboxAsIncomplete(
        checkbox,
        notCompleteIcon,
        loadingIcon,
        completeIcon
      );
    } else {
      markCheckboxAsComplete(
        checkbox,
        notCompleteIcon,
        loadingIcon,
        completeIcon
      );
    }
  };

  checkboxItems.forEach((checkbox) => {
    // CLICK EVENT
    checkbox.addEventListener(clickEvent, () => {
      toggleCompleteCheckbox(checkbox);
    });
  });

  const setTabIndexForInnerItems = (itemIndex) => {
    for (let i = 0; i < accordionItemTitles.length; i++) {
      const items = accordionItems[i].querySelectorAll(".item-content__action");

      if (i === itemIndex) {
        // set tab index for inner elements
        items.forEach((item) => {
          item.tabIndex = "0";
        });
      } else {
        // set tab index for inner elements
        items.forEach((item) => {
          item.tabIndex = "-1";
        });
      }
    }
  };

  const setActivePanel = (index) => {
    // Hide currently active panel
    accordionItems[activeIndex].classList.remove(accordionActiveClass);
    panelElements[activeIndex].ariaHidden = true;
    // Show new active panel
    accordionItems[index].classList.add(accordionActiveClass);
    panelElements[index].ariaHidden = false;
    accordionItemTitles[index].focus();
    setTabIndexForInnerItems(index);
  }

  const setActiveTab = (index) => {
    // Make currently active tab inactive
    tabElements[activeIndex].setAttribute(ariaSelectedAttr, "false");

    // Set the new tab as active
    tabElements[index].setAttribute(ariaSelectedAttr, "true");

    setActivePanel(index);
    activeIndex = index;
  }

  tabElements.forEach((tab, index) => {
    tab.addEventListener(clickEvent, () => {
      setActiveTab(index);
    });

    // KEY PRESS
    tab.addEventListener(keyUpEvent, (event) => {
      const lastIndex = tabElements.length - 1;

      if (event.key === leftArrowKey || event.key === upArrowKey) {
        event.preventDefault();

        if (activeIndex === 0) {
          // First element, jump to last element
          setActiveTab(lastIndex);
        } else {
          // Move left (move to element before)
          setActiveTab(activeIndex - 1);
        }
      } else if (event.key === rightArrowKey || event.key === downArrowKey) {
        event.preventDefault();

        if (activeIndex === lastIndex) {
          // Last element, jump to first element
          setActiveTab(0);
        } else {
          // Move right (move to element after)
          setActiveTab(activeIndex + 1);
        }
      }
    });
  });

  // UPDATE PROGRESS BAR
  const observer = new MutationObserver(callback);

  // Creates the callback function for the observer
  function callback () {
    const progressBarContainer = document.querySelector(".setup-progress__bar");
    const completedCheck = document.querySelectorAll(".setup-checkbox.checked");
    const allChecks = document.querySelectorAll(".setup-checkbox");
    const progressLabel = progressBarContainer.getElementsByTagName("label")[0];
    const progressBar = document.getElementById("setup-progress");

    // Update progress count and percentage
    progressLabel.innerText = `${completedCheck.length} / 5 completed`;
    progressBar.value = `${(completedCheck.length / 5) * 100}`;

    // Set next incomplete element to active
    for (let index = 0; index < allChecks.length; index++) {
      if (!allChecks[index].classList.contains("checked")) {
        setActiveTab(index);
        break;
      }
    }
  }

  //Sets the configuration for the observation of a target (Looking for attributes, childList and characterData)
  const config = { attributes: true, childList: true, characterData: true };

  // adding the observer to every target with the class
  for (let i = 0; i < checkboxItems.length; i++) {
    observer.observe(checkboxItems[i], config);
  }
};

notificationNav();
profileNav();
closeTrialAlert();
toggleSetupDropdown();
openAccordionandToggleSetupCheckBoxes();
