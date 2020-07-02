import React, { Component } from 'react';
import Filter from './Filter';

class LineNav extends Component {
  constructor(props) {
    super(props);
    this.toggleFilter = this.toggleFilter.bind(this);

    const type = {}.toString.call(props.value) || 'string';
    this.state = {
      text: null,
      type,
      filter: false,
      copyAsHTML: type.includes('Element'),
    };
  }

  toggleFilter(e) {
    e.preventDefault();
    const filter = !this.state.filter;
    this.setState({
      filter,
    });
  }

  render() {
    const { value, onFilter } = this.props;
    const { filter } = this.state;

    return (
      <div className="LineNav">
        {typeof value === 'object' &&
          <Filter
            ref={e => (this.filter = e)}
            onFilter={onFilter}
            enabled={filter}
          >
            <button onClick={this.toggleFilter} className="icon search">
              search
            </button>
          </Filter>}
      </div>
    );
  }
}

export default LineNav;
