// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  cropString,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders DOM #text node.
 */
let TextNode = React.createClass({
  displayName: "TextNode",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
    objectLink: React.PropTypes.func,
    attachedNodeFront: React.PropTypes.object,
    onDOMNodeMouseOver: React.PropTypes.func,
    onDOMNodeMouseOut: React.PropTypes.func,
    onInspectIconClick: React.PropTypes.func,
  },

  getTextContent: function (grip) {
    return cropString(grip.preview.textContent);
  },

  getTitle: function (grip) {
    const title = "#text";
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: grip
      }, title);
    }
    return title;
  },

  render: wrapRender(function () {
    let {
      object: grip,
      mode = MODE.SHORT,
      attachedNodeFront,
      onDOMNodeMouseOver,
      onDOMNodeMouseOut,
      onInspectIconClick,
    } = this.props;

    let baseConfig = {className: "objectBox objectBox-textNode"};
    let inspectIcon;
    if (attachedNodeFront) {
      if (onDOMNodeMouseOver) {
        Object.assign(baseConfig, {
          onMouseOver: _ => onDOMNodeMouseOver(attachedNodeFront)
        });
      }

      if (onDOMNodeMouseOut) {
        Object.assign(baseConfig, {
          onMouseOut: onDOMNodeMouseOut
        });
      }

      if (onInspectIconClick) {
        inspectIcon = DOM.a({
          className: "open-inspector",
          draggable: false,
          // TODO: Localize this with "openNodeInInspector" when Bug 1317038 lands
          title: "Click to select the node in the inspector",
          onClick: () => onInspectIconClick(attachedNodeFront)
        });
      }
    }

    if (mode === MODE.TINY) {
      return DOM.span(baseConfig, this.getTitle(grip), inspectIcon);
    }

    return (
      DOM.span(baseConfig,
        this.getTitle(grip),
        DOM.span({className: "nodeValue"},
          " ",
          `"${this.getTextContent(grip)}"`
        ),
        inspectIcon
      )
    );
  }),
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.class == "Text");
}

// Exports from this module
module.exports = {
  rep: TextNode,
  supportsObject: supportsObject
};
