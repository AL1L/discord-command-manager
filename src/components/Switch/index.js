import './Switch.scss';

export function Switch(props) {
  return <div class="switch-input">
    <input type="checkbox" {...props} />
    <div class="switch-body">
      <svg class="slider" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet">
        <rect class="switch-handle" fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
        <svg class="switch-symbol" viewBox="0 0 20 20" fill="none">
          <path></path>
          <path></path>
        </svg>
      </svg>
    </div>
  </div>
}