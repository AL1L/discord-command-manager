import './Switch.scss';

export function Switch(props) {
  return <div className="switch-input">
    <input type="checkbox" {...props} />
    <div className="switch-body">
      <svg className="slider" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet">
        <rect className="switch-handle" fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
        <svg className="switch-symbol" viewBox="0 0 20 20" fill="none">
          <path></path>
          <path></path>
        </svg>
      </svg>
    </div>
  </div>
}