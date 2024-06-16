
import ReactGA from "react-ga4";

const initGA = () => {
  ReactGA.initialize("G-8QCNL37B5L");
};

const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
};

const logEvent = (category = "", action = "") => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

const logException = (description = "", fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};

export { initGA, logPageView, logEvent, logException };
