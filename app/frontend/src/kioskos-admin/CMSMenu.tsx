import React, { useEffect, useState } from "react";
import { Col, Nav } from "react-bootstrap";

export interface MenuOption {
  key: string;
  label: string;
}

export interface CMSMenuProps {
  active: string;
  onSelect: (key: string) => void;
  menuOptions: MenuOption[];
  logoSrc?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const CMSMenu: React.FC<CMSMenuProps> = ({
  active,
  onSelect,
  menuOptions,
  logoSrc = "/logo.png",
  collapsed: collapsedProp,
  setCollapsed: setCollapsedProp,
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsedState, setCollapsedState] = useState(false);
  const collapsed = collapsedProp !== undefined ? collapsedProp : collapsedState;
  const setCollapsed = setCollapsedProp !== undefined ? setCollapsedProp : setCollapsedState;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Col
      xs={12}
      md={isDesktop ? 3 : 12}
      lg={isDesktop ? 2 : 12}
      className="cms-sidebar sidebar-mobile-fixed pb-3"
      style={{
        background: "#23263a",
        boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
        position: isDesktop ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        height: isDesktop ? '100vh' : 'auto',
        transition: 'width 0.7s cubic-bezier(0.4,0.8,0.4,1)',
        width: isDesktop ? (collapsed ? 56 : 240) : '100%',
        minWidth: isDesktop ? (collapsed ? 56 : 240) : '100%',
        maxWidth: isDesktop ? (collapsed ? 56 : 240) : '100%',
        overflow: 'visible',
        zIndex: isDesktop ? 1000 : 100,
      }}
    >
      {/* Desktop collapse/expand button */}
      {isDesktop && (
        <button
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            top: 16,
            right: -18,
            zIndex: 3000,
            background: '#287cfa',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(40,124,250,0.10)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <span
            style={{
              fontSize: 20,
              color: '#fff',
              fontWeight: 700,
              display: 'inline-block',
              transition: 'transform 0.35s cubic-bezier(0.4,0.8,0.4,1)',
            }}
          >
            {collapsed ? '\u2192' : '\u2190'}
          </span>
        </button>
      )}

      {/* Logo en desktop */}
      <div
        className={isDesktop ? "d-flex align-items-center justify-content-center cms-logo" : "d-none"}
        style={{ width: "100%", padding: collapsed ? "12px 0 8px 0" : "24px 0 8px 0", transition: 'padding 0.3s' }}
      >
        {!collapsed && <img src={logoSrc} alt="Kioskos IA" />}
      </div>

      {/* Botón hamburguesa en mobile */}
      <div className={!isDesktop ? "d-block" : "d-none"} style={{ position: "relative", width: "100%" }}>
        <button
          className="hamburger-btn"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((open: boolean) => !open)}
          style={{
            background: "none",
            border: "none",
            padding: 12,
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2000,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              display: "block",
              width: 32,
              height: 4,
              background: "#fff",
              borderRadius: 2,
              marginBottom: 6,
              transition: "0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: 32,
              height: 4,
              background: "#fff",
              borderRadius: 2,
              marginBottom: 6,
              transition: "0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: 32,
              height: 4,
              background: "#fff",
              borderRadius: 2,
              transition: "0.3s",
            }}
          />
        </button>
      </div>

      {/* Navegación */}
      <nav
        className={`cms-menu${menuOpen ? " open" : ""}`}
        style={{
          transition: "max-height 0.4s cubic-bezier(0.4,0.8,0.4,1), opacity 0.4s cubic-bezier(0.4,0.8,0.4,1)",
          maxHeight: !isDesktop ? (menuOpen ? 400 : 0) : 400,
          overflow: "hidden",
          background: "#23263a",
          marginTop: 48,
          borderRadius: 12,
          boxShadow: menuOpen ? "0 2px 12px rgba(40,124,250,0.10)" : "none",
          opacity: isDesktop && collapsed ? 0 : 1,
          pointerEvents: isDesktop && collapsed ? 'none' : 'auto',
        }}
      >
        <Nav
          className="flex-column"
          activeKey={active}
          onSelect={(key: string | null) => key && onSelect(key)}
        >
          {menuOptions.map((opt) => (
            <Nav.Link
              eventKey={opt.key}
              key={opt.key}
              style={{
                color: "#fff",
                fontWeight: active === opt.key ? 700 : 400,
                fontSize: 18,
                padding: collapsed ? "12px 8px" : "12px 24px",
                textAlign: collapsed ? 'center' : 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'padding 0.3s',
              }}
            >
              {!collapsed && opt.label}
              {collapsed && <span style={{ fontSize: 18 }}>{opt.label.charAt(0)}</span>}
            </Nav.Link>
          ))}

          {/* Logout */}
          <Nav.Link
            key="logout"
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              padding: collapsed ? "12px 8px" : "12px 24px",
              marginTop: 16,
              textAlign: collapsed ? 'center' : 'left',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'padding 0.3s',
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("tokenExpiration");
              window.location.reload();
            }}
          >
            {!collapsed && <span style={{ marginRight: 8, fontWeight: 700 }}>⎋</span>}
            {!collapsed ? 'Cerrar sesión' : <span style={{ fontWeight: 700 }}>⎋</span>}
          </Nav.Link>
        </Nav>
      </nav>
    </Col>
  );
};

export default CMSMenu;
