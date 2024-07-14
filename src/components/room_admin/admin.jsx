export const AdminRoom = () => {
    return (
        <div>
            <div class="area"></div>
            <nav class="main-menu">
                <ul>
                    <li>
                        <a href="alphawolfvb.web.app">
                            <i class="fa fa-home fa-2x"></i>
                            <span class="nav-text">
                                Dashboard
                            </span>
                        </a>
                    </li>
                    <li class="has-subnav">
                        <a href="#">
                            <i class="fa fa-globe fa-2x"></i>
                            <span class="nav-text">
                                Global Surveyors
                            </span>
                        </a>
                    </li>
                    <li class="has-subnav">
                        <a href="#">
                            <i class="fa fa-comments fa-2x"></i>
                            <span class="nav-text">
                                Surveyors
                            </span>
                        </a>
                    </li>
                    <li class="has-subnav">
                        <a href="#">
                            <i class="fa fa-list fa-2x"></i>
                            <span class="nav-text">
                                Surveyors
                            </span>
                        </a>
                    </li>
                </ul>
                <ul class="logout">
                    <li>
                        <a href="#">
                            <i class="fa fa-power-off fa-2x"></i>
                            <span class="nav-text">
                                Logout
                            </span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

